import type { LogPersistor } from "../../persistor/log";
import type { DefinitionTask, ProcessorResult, RuntimeInfo } from "../../types/index";
import { WorkflowVM } from "../vm";

export class GuardProcessor {
	constructor(
		public params: {
			task: Extract<DefinitionTask, { type: "GUARD" }>;
			global: Record<string, any>;
			taskResults: Record<string, any>;
			logger: LogPersistor;
			runtimeInfo: Pick<RuntimeInfo, "id" | "definitionId">;
		}
	) {}

	async process(): Promise<ProcessorResult<boolean>> {
		const exec = this.params.task.exec;

		const workflowVM = new WorkflowVM(
			this.params.logger,
			this.params.global,
			this.params.taskResults,
			this.params.runtimeInfo
		);

		const result = await workflowVM.process<boolean>(exec);

		return result;
	}
}
