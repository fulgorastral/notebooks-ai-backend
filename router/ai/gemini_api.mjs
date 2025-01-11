import { GoogleGenerativeAI } from "@google/generative-ai"
import templates from "./templates.mjs";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export async function askGeminiAI(prompt, history, textHistory, currentSection) {

    const messages = [
        "Genera la preparación de un ejercicio basado en la siguiente descripción: " + prompt,
        "El estado inicial de la sección es: " + JSON.stringify(currentSection),
        ...(history?.flatMap(({ prompt, response }) => [prompt, response]) || []),
        "El format JSON consiste en un objeto con las propiedades `height`, `title` y `elements`.",
        "Por ejemplo: {\"height\": 300, \"title\": \"Ejercicio de prueba\", \"elements\": {}}",
        "El objeto elements debe contener los elementos del ejercicio, cada uno con un id único y sus propiedades.",
        "Los elementos también pueden deben tener las propiedades `x`, `y`, `width`, `height` que definen su posición y tamaño.",
        "También deberán tener la propiedad `viewBox` que deberá ajustarse al tamaño del contenido.",
        "Por ejemplo: {\"e1\": { id: \"e1\", \"type\": \"free_form_svg\", \"x\": 10, \"y\": 20, \"width\": 100, \"height\": 50, \"content\": \"<g>...</g>\" }} , \"viewBox\": \"0 0 40 60\"}",
        "El campo `type` de los elementos siempre será `free_form_svg`",
        "Dentro de content puedes incluir contenido SVG. No es necesario que incluyas ningún título en `content` del ejercicio, ya que el título se incluirá en la propiedad `title` del objeto JSON.",
        "Utiliza el contenido del elemento anterior para generar todo tipo de contenido: texto, cajas, flechas, formas, etc.",
        "Puedes incluir tantos elementos como desees, cada uno con un id único",
        "Si quieres añadir una caja, puedes hacerlo con el siguiente formato: {\"id\": \"e1\", \"type\": \"free_form_svg\", \"content\": \"<rect x=\\\"10\\\" y=\\\"20\\\" width=\\\"100\\\" height=\\\"50\\\" fill=\\\"red\\\" />\"}",
        "Si quieres añadir texto, puedes hacerlo con el siguiente formato: {\"id\": \"e1\", \"type\": \"text\", \"x\": 10, \"y\": 20, \"width\": 100, \"height\": 50, \"text\": \"Texto de ejemplo\"}",
        "Si quieres añadir una imagen, puedes hacerlo con el siguiente formato: {\"id\": \"e1\", \"type\": \"image\", \"x\": 10, \"y\": 20, \"width\": 100, \"height\": 50, \"src\": \"https://example.com/image.jpg\"}",
        "Y así sucesivamente con cualquier tipo de contenido SVG, también puedes añadir estilos para que el ejercicio sea más bonito",
        "Si necesitas hacer representar operaciones matemáticas, puedes hacerlo usando el elemento de tipo `basic_operation_v` con el siguiente formato: {\"id\": \"e1\", \"type\": \"basic_operation_v\", \"operator\": \"+\", \"operands\": [\"2\", \"3\"], \"result\": \"5\"}, donde `operator` es el operador, `operands` son los operandos y `result` es el resultado. Si dejas alguno de estos valores en blanco (\"\"), se mostrará una caja para responder. Dimensiones: Cada fila ocupa 40px, ajusta el tamaño a lo alto (50px por fila: operandos y resultado) y ancho (ajusta al tamaño dependiendo del número de dígitos más espacio para el operador y un gap entre ellos) si hay 2 operandos y un resultado, el alto será de 150px.",
        "Recuerda que el contenido debe ser un objeto JSON válido. ",
        "Aquí te dejo unos ejemplos de ejercicios",
        ...templates.map(sData => JSON.stringify(sData)),
        "Procura que los elementos estén bien distribuidos, tengan un tamaño adecuado, esten centrados en el espacio y estén alineados entre sí. Ten en cuenta que para que no se solapen los elementos, hay que tener en cuenta la posición y tamaño de cada uno para evitar poner uno encima de otro.",
        "El ancho disponible es de 640px. Deja 50px libres arriba para evitar que el contenido se solape con el título.",
        'Tu respuesta debe ser únicamente el JSON del ejercicio, no es debes incluir el prompt, ni saludos ni "```json"',
    ]

    console.log(messages)
    const result = await model.generateContent(messages)
    const jsonResult = result.response.text().replace(/```json([\s\S]*?)```/g, "$1")
    return {exerciseJson: jsonResult}
}
