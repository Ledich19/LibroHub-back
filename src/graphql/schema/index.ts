import "./hello";
import "./user/user";
import "./auth/auth";

import { builder } from "../builder";

export const schema = builder.toSchema();

//getSchemaForViewer(request.headers.get('x-schema') ?? 'default')