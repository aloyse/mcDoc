logger.debug("doing readTemplatesAndGenerateNew.js");

var 
	objectTemplate= FileUtil.read($('object.json')),
	project= $('project');

$('groupableObjects').forEach(function(obj){
	var 
		object= ""+obj,
		map= new java.util.HashMap(),
		objectUCF= object[0].toUpperCase()+object.substr(1),
		objectJson,
		objectJsonFile,
		append= false
		;
		
	map.put("object",object);
	map.put("objectUCF",objectUCF);
	objectJson= replacer.replaceValues(objectTemplate, map);
	
	objectJsonFile= project.configDir+object+project.newPostfix+".json";
	
	FileUtil.write(objectJsonFile, append, objectJson);
	
});

