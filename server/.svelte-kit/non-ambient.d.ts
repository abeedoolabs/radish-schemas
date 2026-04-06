
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/health" | "/api/prompts" | "/api/prompts/[type]" | "/api/schemas" | "/api/schemas/[type]" | "/api/to-yaml" | "/api/validate" | "/api/validate/json" | "/docs" | "/schemas" | "/schemas/[type]";
		RouteParams(): {
			"/api/prompts/[type]": { type: string };
			"/api/schemas/[type]": { type: string };
			"/schemas/[type]": { type: string }
		};
		LayoutParams(): {
			"/": { type?: string };
			"/api": { type?: string };
			"/api/health": Record<string, never>;
			"/api/prompts": { type?: string };
			"/api/prompts/[type]": { type: string };
			"/api/schemas": { type?: string };
			"/api/schemas/[type]": { type: string };
			"/api/to-yaml": Record<string, never>;
			"/api/validate": Record<string, never>;
			"/api/validate/json": Record<string, never>;
			"/docs": Record<string, never>;
			"/schemas": { type?: string };
			"/schemas/[type]": { type: string }
		};
		Pathname(): "/" | "/api/health" | `/api/prompts/${string}` & {} | `/api/schemas/${string}` & {} | "/api/to-yaml" | "/api/validate" | "/api/validate/json" | "/docs" | "/schemas" | `/schemas/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/brand/logo-schemas.svg" | "/robots.txt" | string & {};
	}
}