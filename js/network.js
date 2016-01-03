var SCE_NET_AF_INET = 2;
var SCE_NET_SOCK_STREAM = 1;
var SCE_NET_SOCK_DGRAM = 2;
var SIZEOF_SIN = 16;

function createAddressStruct(ip, port) {
	var hexAddr;
	
	if(ip) {
		var addr = ip.split(".");
		var decmAddr = parseInt(addr[0]) * 256 * 256 * 256 + parseInt(addr[1]) * 256 * 256 + parseInt(addr[2]) * 256 + parseInt(addr[3]);
		hexAddr = parseInt(decmAddr).toString(16).toUpperCase();
	}
	else {
		hexAddr = "00000000";
	}
	
	var struct_addr = "";
	
	hostAddrHex = escapeToHex(hexAddr);
	hostPortHex = escapeToHex(baseToBase(10, 16, port));
	
	struct_addr = "\x00\x02"; //sin_family;
	struct_addr += hostPortHex; //sin_port;
	struct_addr += hostAddrHex; //sin_addr;
	struct_addr += "\x00\x00\x00\x00\x00\x00\x00\x00"; //sin_zero[8];
	
	return struct_addr;
}

function sendBuffer(hostAddr, hostPort, address, length) {
	var socket_name = "test";
	var socket_name_loc = chain.data;
	
	var struct_addr = createAddressStruct(hostAddr, hostPort);
	var struct_addr_loc = socket_name_loc + socket_name.length;
	
	writeString(socket_name_loc, socket_name);
	writeString(struct_addr_loc, struct_addr);
	
	chain.call("socket", SCENET, 0x2ff0, socket_name_loc, SCE_NET_AF_INET, SCE_NET_SOCK_STREAM, 0);
	chain.write_rax_ToVariable(0);
	
	chain.read_rdi_FromVariable(0);
	chain.call("connect", SCENET, 0x3030, undefined, struct_addr_loc, SIZEOF_SIN);
	
	chain.read_rdi_FromVariable(0);
	chain.call("send", SCENET, 0x3060, undefined, address, length, 0);
	
	chain.read_rdi_FromVariable(0);
	chain.call("close", SCENET, 0x3100, undefined);
}

function sendMessage(hostAddr, hostPort, message, length) {
	var socket_name = "test";
	var socket_name_loc = chain.data;
	
	var struct_addr = createAddressStruct(hostAddr, hostPort);
	var struct_addr_loc = socket_name_loc + socket_name.length;
	
	var message_loc = struct_addr_loc + struct_addr.length;
	
	writeString(socket_name_loc, socket_name);
	writeString(struct_addr_loc, struct_addr);
	writeString(message_loc, message);
	
	chain.call("socket", SCENET, 0x2ff0, socket_name_loc, SCE_NET_AF_INET, SCE_NET_SOCK_STREAM, 0);
	chain.write_rax_ToVariable(0);
	
	chain.read_rdi_FromVariable(0);
	chain.call("connect", SCENET, 0x3030, undefined, struct_addr_loc, SIZEOF_SIN);
	
	chain.read_rdi_FromVariable(0);
	chain.call("send", SCENET, 0x3060, undefined, message_loc, length, 0);
	
	chain.read_rdi_FromVariable(0);
	chain.call("close", SCENET, 0x3100, undefined);
}

/*function receiveBuffer(hostPort, buffer, length) {
	var socket_name = "test";
	var socket_name_loc = chain.data;
	
	var struct_addr = createAddressStruct(undefined, hostPort);
	var struct_addr_loc = socket_name_loc + socket_name.length;
	
	writeString(socket_name_loc, socket_name);
	writeString(struct_addr_loc, struct_addr);
	
	chain.call("socket", SCENET, 0x2ff0, socket_name_loc, SCE_NET_AF_INET, SCE_NET_SOCK_STREAM, 0);
	chain.call("bind", SCENET, 0x3000, 0x54, struct_addr_loc, SIZEOF_SIN);
	chain.call("listen", SCENET, 0x3010, 0x54, 10);
	chain.call("accept", SCENET, 0x3020, 0x54, 0, 0);
	chain.call("recv", SCENET, 0x3090, 0x55, buffer, length, 0);
}*/

function receiveBufferS1(hostPort, buffer, length) {
	var socket_name = "test";
	var socket_name_loc = chain.data;
	
	var struct_addr = createAddressStruct(undefined, hostPort);
	var struct_addr_loc = socket_name_loc + socket_name.length;
	
	writeString(socket_name_loc, socket_name);
	writeString(struct_addr_loc, struct_addr);
	
	chain.call("socket", SCENET, 0x2ff0, socket_name_loc, SCE_NET_AF_INET, SCE_NET_SOCK_STREAM, 0);
	chain.write_rax_ToVariable(0);
	
	chain.read_rdi_FromVariable(0);
	chain.call("bind", SCENET, 0x3000, undefined, struct_addr_loc, SIZEOF_SIN);
	
	chain.read_rdi_FromVariable(0);
	chain.call("listen", SCENET, 0x3010, undefined, 10);
	
	chain.read_rdi_FromVariable(0);
	chain.call("accept", SCENET, 0x3020, undefined, 0, 0);
}

function receiveBufferS2(hostPort, buffer, length) {
	chain.call("socket", SCENET, 0x2ff0, socket_name_loc, SCE_NET_AF_INET, SCE_NET_SOCK_STREAM, 0);
	chain.call("bind", SCENET, 0x3000, 0x54, struct_addr_loc, SIZEOF_SIN);
	chain.call("listen", SCENET, 0x3010, 0x54, 10);
	chain.call("accept", SCENET, 0x3020, 0x54, 0, 0);
	chain.call("recv", SCENET, 0x3090, 0x55, buffer, length, 0);
}
