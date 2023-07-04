// Basic hacking script, run on a machine it will execute weaken, grow and hack within prescribed limits
export async function main(ns) {
    let target = ns.args[0]
    if (!target) {
        var hostname = ns.getHostname() 
    } else {
        var hostname = ns.args[0]
    }
    var moneyThresh = ns.getServerMaxMoney(hostname) * 0.75;
    var securityThresh = ns.getServerMinSecurityLevel(hostname) + 5;

    while(true) {
        if (ns.getServerSecurityLevel(hostname) > securityThresh) {
            await ns.weaken(hostname);
        } else if (ns.getServerMoneyAvailable(hostname) < moneyThresh) {
            await ns.grow(hostname);
        } else {
            await ns.hack(hostname);
        }
    }
}