export function parseJson(json, filepath) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error(`Прошла ошибка парсинга JSON в файле ${filepath}`, e);
    process.exit(1);
  }
}
