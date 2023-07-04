/** @param {NS} ns */
export async function main(ns) {

	// Player current money
	let current_money = ns.getServerMoneyAvailable("home")

	// Calculate the cost of 25x servers with the most RAM, given current money
	// Terminate script if 25x cannot be purchased with at least 4GB RAM
	let minimum_ram_amount = 4;
	if ((ns.getPurchasedServerCost(minimum_ram_amount) * 25) > current_money) {
		ns.tprint('Not enough money for 25x minimum 4GB servers')
		return;
	}

	// Get a list of current, purchased servers so they can be removed
	existing_servers = ns.getPurchasedServers();
	
	for (let i in existing_servers) {
		// Kill all running scrips on current servers
		ns.killall(existing_servers[i]);
		// Delete all current purchased servers
		ns.deleteServer(existing_servers[i]);
	}

	// Step forward in a loop to calculate the best quality servers that can be afforded
	let ram_amount = 1048576;
	while ((ns.getPurchasedServerCost(ram_amount) * 25) > current_money) {
		ram_amount = ram_amount / 2
	}

	// Purchase servers with appropriate RAM
	for (i = 0; i < 25; ++i) {
		purchaseServer('purchased-server', ram_amount);
	}

	ns.tprint("Servers purchased successfully, remember to re-run scripts if needed");
}