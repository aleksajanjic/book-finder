export function workKeyToId(key: string): string | undefined {
	return key.split("/").pop();
}
