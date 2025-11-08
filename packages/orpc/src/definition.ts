import { oc } from "@orpc/contract";
import { z } from "zod/v3";

export const createDefinitionContract = oc
	.route({
		method: "POST",
		path: "/definition/create",
		description: "It will create a new workflow definition",
		summary: "Create Definition",
		successStatus: 201,
		tags: ["Definition"],
	})
	.input(
		z.object({
			name: z.string().trim().min(1, "Name is required"),
			description: z.string().trim().min(1, "Description is required"),
			type: z.enum(["template", "definition"]).default("definition"),
			global: z.array(
				z.object({
					key: z.string(),
					value: z.string(),
				})
			),
			status: z.enum(["active", "inactive"]).default("active"),
			uiObject: z.record(z.string(), z.any()),
			tasks: z.array(z.record(z.string(), z.any())),
		})
	)
	.output(
		z.object({
			message: z.string(),
			data: z.object({
				id: z.number().describe("Created Definition Id"),
			}),
		})
	)
	.errors({
		INTERNAL_SERVER_ERROR: {
			message: "Create Definition failed",
		},
		BAD_REQUEST: {
			message: "Can't create definition",
		},
	});

export const updateDefinitionContract = oc
	.route({
		method: "PATCH",
		path: "/definition/edit/{id}",
		description: "It will update a workflow definition",
		summary: "Update Definition",
		successStatus: 200,
		inputStructure: "detailed",
		tags: ["Definition"],
	})
	.input(
		z.object({
			params: z.object({
				id: z.coerce.number().describe("Definition Id"),
			}),
			body: z.object({
				name: z.string().trim().min(1, "Name is required"),
				description: z.string().trim().min(1, "Description is required"),
				type: z.enum(["template", "definition"]).default("definition"),
				global: z.array(
					z.object({
						key: z.string(),
						value: z.string(),
					})
				),
				status: z.enum(["active", "inactive"]).default("active"),
				uiObject: z.record(z.string(), z.any()),
				tasks: z.array(z.record(z.string(), z.any())),
			}),
		})
	)
	.output(
		z.object({
			message: z.string(),
			data: z.object({
				id: z.number().describe("Updated Definition Id"),
			}),
		})
	)
	.errors({
		INTERNAL_SERVER_ERROR: {
			message: "Edit Definition failed",
		},
		BAD_REQUEST: {
			message: "Can't edit definition",
		},
		NOT_FOUND: {
			message: "Definition not found",
		},
	});

export const listDefinitionContract = oc
	.route({
		method: "GET",
		path: "/definition/list",
		description: "It will list all workflow definitions",
		summary: "List Definition",
		successStatus: 200,
		tags: ["Definition"],
	})
	.input(
		z.object({
			page: z.coerce.number().optional().default(1).catch(1).describe("Page number"),
			limit: z.coerce.number().optional().default(10).catch(10).describe("Limit number"),
		})
	)
	.output(
		z.object({
			message: z.string(),
			data: z.object({
				list: z.array(
					z
						.object({
							id: z.number().describe("Definition Id"),
							name: z.string().describe("Definition Name"),
							description: z.string().describe("Definition Description"),
							status: z.enum(["active", "inactive"]).describe("Definition Status"),
							createdAt: z.string().nullish().describe("Definition Created At"),
						})
						.passthrough()
				),
				pagination: z.object({
					total: z.number().describe("Total count of definitions"),
					page: z.number().describe("Current page number"),
					size: z.number().describe("Number of items per page"),
				}),
			}),
		})
	);

export const fetchEditDefinitionContract = oc
	.route({
		method: "GET",
		path: "/definition/edit/{id}",
		description: "It will fetch workflow definition for editing",
		summary: "Fetch Edit Definition",
		successStatus: 200,
		tags: ["Definition"],
	})
	.input(
		z.object({
			id: z.coerce.number().describe("Definition Id"),
		})
	)
	.output(
		z.object({
			message: z.string(),
			data: z.object({
				id: z.number().describe("Definition Id"),
				name: z.string().describe("Definition Name"),
				description: z.string().describe("Definition Description"),
				global: z
					.array(
						z.object({
							key: z.string().describe("Global Key"),
							value: z.string().describe("Global Value"),
						})
					)
					.nullish(),
				uiObject: z.any(),
			}),
		})
	)
	.errors({
		NOT_FOUND: {
			message: "Definition not found",
		},
		INTERNAL_SERVER_ERROR: {
			message: "Internal server error",
		},
	});

export const deleteDefinitionContract = oc
	.route({
		method: "DELETE",
		path: "/definition/delete/{id}",
		description: "It will delete workflow definition",
		summary: "Delete Definition",
		successStatus: 200,
		tags: ["Definition"],
	})
	.input(
		z.object({
			id: z.coerce.number().describe("Definition Id"),
		})
	)
	.output(
		z.object({
			message: z.string(),
		})
	)
	.errors({
		NOT_FOUND: {
			message: "Definition not found",
		},
		INTERNAL_SERVER_ERROR: {
			message: "Internal server error",
		},
	});

export const fetchDefinitionContract = oc
	.route({
		method: "GET",
		path: "/definition/{id}",
		description: "It will fetch workflow definition",
		summary: "Fetch Definition",
		successStatus: 200,
		tags: ["Definition"],
	})
	.input(
		z.object({
			id: z.coerce.number().describe("Definition Id"),
		})
	)
	.output(
		z.object({
			message: z.string(),
			data: z.object({
				id: z.number().describe("Definition Id"),
				name: z.string().describe("Definition Name"),
				description: z.string().describe("Definition Description"),
				global: z
					.array(
						z.object({
							key: z.string().describe("Global Key"),
							value: z.string().describe("Global Value"),
						})
					)
					.nullish(),
				status: z.enum(["active", "inactive"]).describe("Definition Status"),
				type: z.enum(["template", "definition"]).nullable().describe("Definition Type"),
				createdAt: z.string().nullish().describe("Definition Created At"),
				tasks: z.array(z.any()).nullish().describe("Definition Tasks"),
			}),
		})
	)
	.errors({
		NOT_FOUND: {
			message: "Definition not found",
		},
		INTERNAL_SERVER_ERROR: {
			message: "Internal server error",
		},
	});
