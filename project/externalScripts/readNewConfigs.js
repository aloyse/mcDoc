logger.debug("doing readNewConfigs.js");

const NONEXISTING= "NONEXISTING-ID";
var 
	project= $('project'),
	objectTemplate= FileUtil.read($('object.json')),
	model= {
		"_byName": {},
		"_report": {
			"objectCount": {},
			"duplicates": [],
			"errors": []
		}
	}
	;

$('groupableObjects').forEach(function(go){
	var 
		grobj= ""+go,
		objFile= project.configDir+grobj+project.newPostfix+".json",
		objDefStr= "",
		objDefObj= {},
		counter= 1,
		format= grobj.substring(0,3)+"%03d",
		idPattern= RegExp(grobj.substring(0,3)+"(\\d{3})","i")
		;
	if (model[grobj] === undefined) {
		model[grobj]= {};
	}
	
	try {
		objDefStr= FileUtil.read(objFile);
		channelMap.put(grobj+"objDefStr",objDefStr);
		objDefObj= JSON.parse(objDefStr);
	} catch(e) {
		logger.debug("Problem loading or parsing file ["+objFile+"]:"+e);
	}
	objDefObj[grobj+"s"].forEach(function(o){
		var
			name= o.name,
			goName= grobj+"-"+name,
			id= o.id || NONEXISTING,
			skip= false,
			addObject= false,
			modelObject= {
				"name": name,
				"id": null,
				"type": grobj
				}
			;
		logger.debug("Object name: "+name);
		
		if (model._byName[goName]){
			model._report.duplicates.push(grobj+"-"+name);
			skip= true;
		}
		if (model[grobj][id]){
			model._report.duplicates.push(grobj+"-id-"+id);
			skip= true;
		}
		if (! skip) {
			if(id === NONEXISTING) {
				id= java.lang.String.format(format, java.lang.Integer(counter));
				counter+= 1;
				addObject= true;
			}
			else if(idPattern.test(id)){
				counter= parseInt((id.match(idPattern))[1], 10) +1;
				addObject= true;
			}
			else {
				model._report.errors.push("bad id["+id+"] for name:"+goName);
			}
			
			if(addObject){
				modelObject.id= model._byName[goName]= id;
				model[grobj][id]= modelObject;
			}
		}
	});

	objDefObj[grobj+"Groups"].forEach(function(o){
		logger.debug("Group name: "+o.name);
	});

	channelMap.put("model",model);
});