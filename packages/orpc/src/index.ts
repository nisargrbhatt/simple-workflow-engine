import {
	createDefinitionContract,
	listDefinitionContract,
	fetchEditDefinitionContract,
	deleteDefinitionContract,
	fetchDefinitionContract,
	updateDefinitionContract,
} from "./definition";
import { processTaskContract, startEngineContract } from "./engine";
import { oc } from "@orpc/contract";
import { getRuntimeContract, listRuntimeContract } from "./runtime";
import { livenessContract, readinessContract } from "./health";

export const contractRouter = {
	health: oc.router({
		liveness: livenessContract,
		readiness: readinessContract,
	}),
	engine: oc.router({
		start: startEngineContract,
		process: processTaskContract,
	}),
	definition: oc.router({
		create: createDefinitionContract,
		list: listDefinitionContract,
		fetchEdit: fetchEditDefinitionContract,
		delete: deleteDefinitionContract,
		get: fetchDefinitionContract,
		edit: updateDefinitionContract,
	}),
	runtime: oc.router({
		list: listRuntimeContract,
		get: getRuntimeContract,
	}),
};
