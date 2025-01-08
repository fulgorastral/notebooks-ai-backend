import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// Ask the AI for an exercise
export async function askAI(prompt, history, textHistory, currentSection) {
    try {
        console.log(`[STEP 0]: Asking AI for exercise based on prompt: ${prompt}`);

        // First call to generate the exercise in plain text
        const textResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { "role": "system", "content": "Genera un ejercicio en texto plano basado en la siguiente descripción: " + prompt },
                { "role": "system", "content": "El ejercicio se ilustrará más adelante, por lo si alguna parte del ejercicio requiere una imagen o SVG, añade una marca, ejm: `[<insertar aquí una descripción del lo que necesitamos>]`que indique que se debe incluir dicho recurso y qué relación tiene con el texto." },
                { "role": "system", "content": "Inicialmente la sección tenía estos valores: " + JSON.stringify(currentSection) },
                ...textHistory.map(({ prompt, response }) => [{ "role": "user", "content": prompt }, { "role": "system", "content": response }]).flat(),
            ],
        });

        const exerciseText = textResponse.choices[0].message.content;
        console.log("[STEP 1]: Successfully created exercise:", exerciseText);

        // Second call to convert the exercise to JSON format
        const jsonResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { "role": "system", "content": "El estado inicial de la sección es: " + JSON.stringify(currentSection) },
                ...history.map(({ prompt, response }) => [{ "role": "user", "content": prompt }, { "role": "system", "content": response }]).flat(),
                { "role": "system", "content": 'Convierte el siguiente ejercicio en texto plano al formato JSON requerido: ' + exerciseText },
                { "role": "system", "content": "El format JSON consiste en un objeto con las propiedades `height`, `title` y `elements`." },
                { "role": "system", "content": "Por ejemplo: {\"height\": 300, \"title\": \"Ejercicio de prueba\", \"elements\": {}}" },
                { "role": "system", "content": "El objeto elements debe contener los elementos del ejercicio, cada uno con un id único y sus propiedades." },
                { "role": "system", "content": "Los elementos también pueden deben tener las propiedades `x`, `y`, `width`, `height` que definen su posición y tamaño." },
                { "role": "system", "content": "También deberán tener la propiedad `viewBox` que deberá ajustarse al tamaño del contenido." },
                { "role": "system", "content": "Por ejemplo: {\"e1\": { id: \"e1\", \"type\": \"free_form_svg\", \"x\": 10, \"y\": 20, \"width\": 100, \"height\": 50, \"content\": \"<g>...</g>\" }} , \"viewBox\": \"0 0 40 60\"}" },
                { "role": "system", "content": "El campo `type` de los elementos siempre será `free_form_svg`" },
                { "role": "system", "content": "Dentro de content puedes incluir contenido SVG. No es necesario que incluyas ningún título en `content` del ejercicio, ya que el título se incluirá en la propiedad `title` del objeto JSON." },
                { "role": "system", "content": "Utiliza el contenido del elemento anterior para generar todo tipo de contenido: texto, cajas, flechas, formas, etc." },
                { "role": "system", "content": "Puedes incluir tantos elementos como desees, cada uno con un id único" },
                { "role": "system", "content": "Si quieres añadir texto, puedes hacerlo con el siguiente formato: {\"id\": \"e1\", \"type\": \"free_form_svg\", \"content\": \"<text x=\\\"10\\\" y=\\\"20\\\">Hola mundo</text>\"}" },
                { "role": "system", "content": "Si quieres añadir una caja, puedes hacerlo con el siguiente formato: {\"id\": \"e1\", \"type\": \"free_form_svg\", \"content\": \"<rect x=\\\"10\\\" y=\\\"20\\\" width=\\\"100\\\" height=\\\"50\\\" fill=\\\"red\\\" />\"}" },
                { "role": "system", "content": "Y así sucesivamente con cualquier tipo de contenido SVG, también puedes añadir estilos para que el ejercicio sea más bonito" },
                { "role": "system", "content": "Si necesitas hacer representar operaciones matemáticas, puedes hacerlo usando el elemento de tipo `basic_operation_v` con el siguiente formato: {\"id\": \"e1\", \"type\": \"basic_operation_v\", \"operator\": \"+\", \"operands\": [\"2\", \"3\"], \"result\": \"5\"}, donde `operator` es el operador, `operands` son los operandos y `result` es el resultado. Si dejas alguno de estos valores en blanco (\"\"), se mostrará una caja para responder. Dimensiones: Cada fila ocupa 40px, ajusta el tamaño a lo alto (50px por fila: operandos y resultado) y ancho (ajusta al tamaño dependiendo del número de dígitos más espacio para el operador y un gap entre ellos) si hay 2 operandos y un resultado, el alto será de 150px." },
                { "role": "system", "content": "Recuerda que el contenido debe ser un objeto JSON válido. " },
                { "role": "system", "content": "Procura que los elementos estén bien distribuidos, tengan un tamaño adecuado, esten centrados en el espacio y estén alineados entre sí. Ten en cuenta que para que no se solapen los elementos, hay que tener en cuenta la posición y tamaño de cada uno para evitar poner uno encima de otro." },
                { "role": "system", "content": "El ancho disponible es de 640px. Deja 50px libres arriba para evitar que el contenido se solape con el título." },
                { "role": "system", "content": 'Tu respuesta debe ser únicamente el JSON del ejercicio, no es necesario que incluyas el prompt, ni saludos ni "```json".' }
            ],
        });

        const exerciseJson = jsonResponse.choices[0].message.content;
        console.log("[STEP 2]: Successfully created exercise:", exerciseJson);

        return {exerciseJson, exerciseText};
    } catch (error) {
        console.error("Error creating exercise:", error);
        throw error;
    }
}