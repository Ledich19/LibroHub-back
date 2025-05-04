import "./hello";
import "./user/user";

import { builder } from "../builder";

export const schema = builder.toSchema();

//getSchemaForViewer(request.headers.get('x-schema') ?? 'default')