


function Structure(moc)
{
	this.structure_examples = 
	{
		0:   "glass, paper, soap bubbles... like a tent / hot air balloon / butterfly",
		0.5: "rope, drywall, plastic, flesh... like a plastic outhouse / hang glider / minifig",
		1:   "wood, sheet metal, steel cables, kevlar... like a wooden house / car / troll",
		2:   "brick, log walls, wrought iron... like a brick outhouse / pirate ship / dragon",
		3:   "concrete, stone, steel plating...like a castle / tank / stone golem",
		4:   "heavy steel, reinforced concrete... like a nuclear bunker / capital starship",
		5:   "adamantite, kanon... like a BrikThulhuminati pyramid / Dungam mobile suit",
	};

	this.size = 2;
	
	this.structureLevel = 1;
	
	this.armorText = "1d10";
	this.armor;
	this.customArmor = false;
	
	this.cost = 0;
	this.moc = moc;
	
	this.calculate = function()
	{
		if(isNaN(this.size)) this.size = 0;
		this.size = Math.max(0,Math.round(this.size));
		if(!this.customArmor)
		{
			// limit: armor level <= size
			this.structureLevel = Math.min(this.size, this.structureLevel);
		}
		// round to halves
		this.structureLevel = Math.round(2 * this.structureLevel) / 2.0;
		this.cost = this.size * this.structureLevel;
	};
	
	this.applyFrom = function(form)
	{
		this.size = form.structure_size.value;
		this.customArmor = form.custom_armor.checked;
		
		if(!this.customArmor)
		{
			this.structureLevel = form.structure_level.options[form.structure_level.selectedIndex].value;
			this.armor = this.getArmorByStructureLevel(this.structureLevel);
			this.armorText = form.structure_level.options[form.structure_level.selectedIndex].innerHTML;
		}
		else
		{
			this.armorText = form.armor.value;
			this.armor = this.getArmorByArmorText(this.armorText);
			this.structureLevel = this.getStructureLevelByArmor(this.armor);
		}
	};
	
	this.updateForm = function(form)
	{
		form.structure_size.value = this.size;
		form.custom_armor.checked = this.customArmor;
		form.armor.value = this.armorText;
		
		var options = form.structure_level.options;
		for(var i=0; i<options.length; ++i)
		{
			var option = options[i];
			// disable/enable
			option.disabled = option.value > this.size;
			
			// select selected
			if(option.value == this.structureLevel)
			{
				form.structure_level.selectedIndex = i;
			}
		}

		form.structure_level.disabled = this.customArmor;
		form.armor.disabled = !this.customArmor;
		document.getElementById("standard_armor_div").style.display = this.customArmor ? "none" : "block";
		document.getElementById("custom_armor_div").style.display = !this.customArmor ? "none" : "block";
		
		// example
		this.updateHelp(form);
		// cost
		form.structure_cost.value = this.cost;
	};

	
	this.getArmorRating = function(lvl)
	{
		if(this.customArmor)
		{
			return this.armorText;
		}
		else
		{
			if(typeof lvl === "undefined")
				lvl = this.structureLevel;
				
			if(lvl == 0) return "0";
			else if(lvl == 0.5) return "1d6";
			else return lvl + "d10";
		}
	};
	
	this.updateHelp = function(form)
	{
		var lvl = form.structure_level.options[form.structure_level.selectedIndex].value;
		document.getElementById("structure_example").innerHTML = "  (material like " + this.structure_examples[lvl] + ")";
	}
	
	this.getArmorByArmorText = function (text)
	{
		text = text.replace(/ /g,''); // remove whitespaces
		var equation = text.split(/([\+\-])/); // split by +,-
		// calculate those xdy
		for (var i = 0; i < equation.length; i += 2)
		{
			var d_thing = equation[i].match(/([0-9]*)d([0-9]+)/);
			if(d_thing && d_thing.length == 3)
			{
				var a;
				if(d_thing[1] == "") a = 1;
				else a = parseInt(d_thing[1]);
				
				var b = parseInt(d_thing[2]);
				
				if(a != NaN && b != NaN)
				{
					equation[i] = a * (b/2.0 + 0.5);
				}
			}
		}
		// fix first "-" if any
		if(equation.length > 2 && equation[1] == '-' && equation[0] == '')
		{
			equation[2] = "-" + equation[2];
			equation = equation.slice(2);
		}
		// equate
		var result = 0;
		for (var i = 0; i < equation.length; i += 2)
		{
			var sign = 1;
			if(i > 1 && equation[i-1] == "-")
			{
				sign = -1;
			}
			result += equation[i] * sign;
		}
		return result;
	};
	
	
	this.getStructureLevelByArmor = function(ar)
	{
		if (ar > 4) return ar / 5.5;
		else return sl = ar / 7;
	};
	
	this.getArmorByStructureLevel = function(sl)
	{
		if(sl >= 1) return sl * 5.5;
		else return sl * 7;
	}
}
