/** @param {NS} ns */
export async function main(ns) {

	// Determine hackill skill for later check against target server
	var player_hacking_level = ns.getHackingLevel();

	// Determine memory requirements of campaign script
	var script_ram_requirement = ns.getScriptRam(ns.args[0])

	// Determine number of port crack tools available
	var programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
	var programCount = 0;
	programs.forEach(function(program) { 
		if(ns.fileExists(program)) { 
			programCount++; 
		} 
	});

	// Create a list of servers that are scanable
	let hostnames = ['home'];
	for (let i = 0; i < hostnames.length; i++) {
		hostnames.push(...ns.scan(hostnames[i]).filter(hostname => !hostnames.includes(hostname)))
	}
	// Add purchased servers to the list
	let purchased_servers = ns.getPurchasedServers
	for (let i in purchased_servers) {
		hostnames.push(purchased_servers[i])
	}
	
	// Create the main iterator over the hostnames list
	for (let i in hostnames) {
		// Check required hacking level and number of port tools available and skip loop if not
		if (ns.getServerRequiredHackingLevel(hostnames[i]) > player_hacking_level ||
			ns.getServerNumPortsRequired(hostnames[i]) > programCount) {
			continue
		}
		// Crack server ports and nuke
		if(ns.fileExists(programs[0])) {
			ns.brutessh(hostnames[i]);
		}
		if(ns.fileExists(programs[1])) {
			ns.ftpcrack(hostnames[i]);
		} 
		if(ns.fileExists(programs[2])) {
			ns.relaysmtp(hostnames[i]);
		} 
		if(ns.fileExists(programs[3])) {
			ns.httpworm(hostnames[i]);
		} 
		if(ns.fileExists(programs[4])) {
			ns.sqlinject(hostnames[i]);
		}
		ns.nuke(hostnames[i]);
		
		// Kill any existing scripts to refresh the campaign
		ns.killall(hostnames[i]);

		// Calculate number of threads possible on campaign script, if zero (no RAM on server, skip)
		var server_max_ram = ns.getServerMaxRam(hostnames[i])
		if(server_max_ram = 0) {
			continue
		}
		var thread_count = Math.floor((ns.getServerMaxRam(hostnames[i]) / script_ram_requirement))

		// Copy the campaign script to target machine
		ns.scp(ns.args[0], hostnames[i]);

		// Execute script on target machine
		if (ns.args[1]) {
			ns.exec(ns.args[0], hostnames[i], thread_count, ns.args[1]);
		} else {
			ns.exec(ns.args[0], hostnames[i], thread_count);
		}
	}
}