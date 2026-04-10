import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const typesSchema = JSON.parse(
  readFileSync(join(__dirname, 'types.schema.json'), 'utf-8')
);

export const rolesSchema = JSON.parse(
  readFileSync(join(__dirname, 'roles.schema.json'), 'utf-8')
);

export const appSchema = JSON.parse(
  readFileSync(join(__dirname, 'app.schema.json'), 'utf-8')
);

export const uiSchema = JSON.parse(
  readFileSync(join(__dirname, 'ui.schema.json'), 'utf-8')
);

export const componentsSchema = JSON.parse(
  readFileSync(join(__dirname, 'components.schema.json'), 'utf-8')
);

export const themeSchema = JSON.parse(
  readFileSync(join(__dirname, 'theme.schema.json'), 'utf-8')
);

export function getSchema(name) {
  switch (name) {
    case 'types':
      return typesSchema;
    case 'roles':
      return rolesSchema;
    case 'app':
      return appSchema;
    case 'ui':
      return uiSchema;
    case 'components':
      return componentsSchema;
    case 'theme':
      return themeSchema;
    default:
      throw new Error(`Unknown schema: ${name}`);
  }
}
