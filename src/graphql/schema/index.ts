import "./hello";
import "./user";
import "./auth/auth";
import "./author";
import "./filters";
import "./language";
import "./books";
import "./series";

import { builder } from "../builder";

export const schema = builder.toSchema();

//getSchemaForViewer(request.headers.get('x-schema') ?? 'default')