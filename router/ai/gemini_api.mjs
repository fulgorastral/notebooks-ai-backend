import { GoogleGenerativeAI } from '@google/generative-ai'
import templates from './templates.mjs'


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

export async function askGeminiAI(body) {
    const { prompt, history, textHistory, currentSection, neae, neaeDetails, subject } = body

    const messages_app_context = [
        'Eres una IA que parte de una app de construcción de ejercicios. Los usuarios son profesores de infantil y primaria de cualquier materia. Tu objetivo es ayudar a los profesores a crear ejercicios o modificar los ejercicios que te pasen',
        'La app tomará los datos actuales de un ejercicio y te los pasará para que puedas generar un nuevo ejercicio o modificar el actual según las indicaciones del profesor', 
        'La app también está orientada a adaptar los ejercicios a las necesidades de los alumnos, por lo que el profesor podrá pedirte que modifiques el ejercicio actual para adaptarlo a las necesidades de un alumno concreto.',
        'Los ejercicios estan pensados para ser impresos en papel, por lo que no es necesario que sean interactivos, pero si que sean visuales y atractivos para los alumnos.',
    ]



    const messages_exercise_structure = [
        'La respuesta esperada es un objeto JSON que será usado para renderizar el ejercicio en la app. ',
        'El objeto debe contener las propiedades `height`, `title` y `elements`. Ejemplo: {"height": 100, "title": "Ejercicio de ejemplo", "elements": {}}',
        'La propiedad `height` define la altura del ejercicio en píxeles. Puedes ajustarla para controlar el tamaño del ejercicio, procura dejar suficiente espacio para que el contenido sea visible más un poco de margen.',
        'La propiedad `title` define el título del ejercicio. Aquí podrás incluir el enunciado del ejercicio, instrucciones o cualquier otro texto que quieras mostrar en la parte superior del ejercicio.',
        'La propiedad `elements` es un objeto que contiene los elementos del ejercicio. Cada elemento debe tener un id único y sus propiedades.',
    ]

    const messages_options = [
        'El profesor ha seleccionado las siguientes opciones para el ejercicio:',
        neae && `NEAE: ${neae}`,
        neaeDetails && `Detalles NEAE: ${neaeDetails}`,
        subject && `Asignatura: ${subject}`,
        'Utiliza estas opciones para adaptar el ejercicio a las necesidades del alumno.',
    ].filter(Boolean)

    const messages_elements = [
        'El objeto `elements` debe contener los elementos (componenentes, widgets, etc) del ejercicio, cada uno con un id único y sus propiedades.',
        'Existen varios tipos de elementos que puedes incluir en el ejercicio.',
        'Todos los elementos deben tener las propiedades `id`, `type`, `x`, `y`, `width`, `height`',
        'Las propiedades `x` e `y` definen la posición del elemento en el ejercicio, y las propiedades `width` y `height` definen su tamaño.',
        'Puedes incluir tantos elementos como desees, cada uno con un id único',
        'Pero además, cada tipo de elemento puede tener propiedades adicionales que definen su contenido y comportamiento.',
        ' - El elemento más versátil es el de tipo `free_form_svg`, que te permite incluir contenido SVG personalizado en el ejercicio.',
        '   El objeto `free_form_svg` deberán tener la propiedad `viewBox` que deberá ajustarse al tamaño del contenido.',
        '   Por ejemplo: {"e1": { id: "e1", "type": "free_form_svg", "x": 10, "y": 20, "width": 100, "height": 50, "content": "<g>...</g>" }} , "viewBox": "0 0 40 60"}',
        '   Dentro de content puedes incluir contenido SVG, (sin el tag `<svg>` ya que se añade automáticamente).',
        '   Utiliza el contenido del elemento `free_form_svg` para generar todo tipo de contenido: texto, cajas, flechas, formas, etc. Aprovecha las posibilidades de SVG para hacer ejercicios atractivos y visuales.',
        '   Si quieres añadir una caja, puedes hacerlo con el siguiente formato: {"id": "e1", "type": "free_form_svg", "content": "<rect x=\\"10\\" y=\\"20\\" width=\\"100\\" height=\\"50\\" fill=\\"red\\" />"}',
        ' - El elemento de tipo `text` se usará para editar textos (utiliza únicamente este element para añadir textos que incluyes las funcionalidades necesarias para permitir su edición por el profesor), Ejemplo: {"id": "e1", "type": "text", "x": 10, "y": 20, "width": 100, "height": 50, "text": "Texto de ejemplo"}',
        ' - El elemento de tipo `image` se usará para añadir imágenes, Ejemplo: {"id": "e1", "type": "image", "x": 10, "y": 20, "width": 100, "height": 50, "src": "https://example.com/image.jpg"}',
        ' - El elemento de tipo `basic_operation_v` se usará para representar operaciones matemáticas verticales, Ejemplo: {"id": "e1", "type": "basic_operation_v", "operator": "+", "operands": ["2", "3"], "result": "5"}',
        '   Este elemento representa una operación matemática vertical, con un operador (+, -, *, /) y una lista de operandos y resultado. Puedes incluir tantos operandos como desees (pero usarás normalmente solo 2 operandos). Tanto los operandos como el resultado, admiten dejar el valor vacío para ejercicios de rellenar huecos con el número correcto.',
    ]

    const messages_exercise_context_initial = [
        'El estado inicial de la sección era: ' + JSON.stringify(currentSection),
    ]

    const messages_exercise_context_history = [
        'El historial de la sección es: ' + JSON.stringify(history),
    ]

    const messages_templates = [
        'Aquí tienes algunos ejemplos de ejercicios ya creados que puedes usar como referencia para crear el nuevo ejercicio (no hace falta que los copies exactamente, puedes modificarlos a tu gusto):',
        ...templates.map(sData => JSON.stringify(sData)),
    ]

    const messages_response_criteria = [
        'Recuerda que el contenido debe ser un objeto JSON válido.', 
        'Aunque la pregunta del profesor sea ambigua, intenta siempre generar un ejercicio que tenga sentido y sea visualmente atractivo para los alumnos.',
        'Si el profesor te pide alguna modificación en el ejercicio actual, intenta siempre mantener la estructura del ejercicio original y solo modificar los elementos necesarios.',
        'Recuerda que el objetivo es ayudar a los profesores, no resuelvas el ejercicio por ellos, solo genera el contenido visual del ejercicio para el alumno lo resuelva.',
        'Tu respuesta debe ser únicamente el JSON del ejercicio, no es debes incluir ningun tipo de saludo, ni de sintaxis markdown como "```json"',
    ]

    const messages = [
        messages_app_context,
        messages_options.length > 2 && messages_options,  // Only show options if there are more than 2 lines (the first and last lines are meant to introduce and close the options but they are not options themselves)
        messages_exercise_structure,
        messages_elements,
        messages_exercise_context_initial,
        messages_exercise_context_history,
        messages_templates,
        `El prompt del profesor es: ${prompt}`,
        messages_response_criteria,
    ].flat().filter(Boolean)

    console.log(` ------------------------- [QUERY] -------------------------`)
    console.log(`[INFO] Request to Gemini AI:`)
    console.log(` - Prompt: ${prompt}`)
    console.log(` - History count: ${history.length}`)
    console.log(` - Options:`)
    console.log(`   - NEAE: ${neae}`)
    console.log(`   - NEAE Details: ${neaeDetails}`)
    console.log(`   - Subject: ${subject}`)
    console.log(`[INFO] Asking Gemini AI...`)

    const result = await model.generateContent(messages)
    // Parse the response to extract the JSON result
    const jsonResult = result.response.text().replace(/```json([\s\S]*?)```/g, '$1')

    console.log(`[RESULT] Response sent to the client...`)
    
    return { exerciseJson: jsonResult }
}
