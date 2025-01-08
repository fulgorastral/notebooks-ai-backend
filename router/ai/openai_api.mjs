import OpenAI from "openai"


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// Ask the AI for an exercise
export async function askAI(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { "role": "system", "content": 'Eres una IA que se dedica a crear ejercicios para niños de primaria. El usuario the va a pedir que generes un ejercicio con unas características concretas y tendrás que generar un un ejercicio el cual estará representado por un JSON el cual se rederizará más adelante.'},
                { "role": "system", "content": 'El JSON que tienes que generar debe tener las siguientes propiedades propiedades: `height` lo cual será la altura de la sección, `title` título del ejercicio, `elements` objeto que contendrá los elementos que podrás usar para construir ele ejercicio '},
                { "role": "system", "content": 'Los elementos que podrás usar son: `text`, `image`, `calligraphy`, `basic_operation_v`, `circle`, `triangle`, `rectangle`'},
                { "role": "system", "content": 'Todos los elementos tendrán las siguientes propiedades: `id`, `type`, `x`, `y`, `width`, `height`'},
                { "role": "system", "content": 'El espacio disponible para el ejercicio es de 640px de ancho y de alto lo tu especificarás con la propiedad `height`'},
                { "role": "system", "content": 'Puedes utilizar el `height` del ejercicio como referencia para acomodar los elementos. Utiliza las propiedades `x` y `y` para posicionar los elementos y `width` y `height` para darles tamaño'},
                { "role": "system", "content": 'Hay elementos con propiedades adicionales: '},
                { "role": "system", "content": '`text` tiene la propiedad `text` que es el texto que se mostrará'},
                { "role": "system", "content": '`image` tiene la propiedad `src` que es la URL de la imagen'},
                { "role": "system", "content": '`calligraphy` tiene la propiedad `text` que es el texto que se mostrará'},
                { "role": "system", "content": '`basic_operation_v` tiene las propiedades `operator="+" (opciones: "+", "-", "*", "/")`, `operands=[]`, `result` que son el operador, los operandos y el resultado de la operación. Puedes dejar un hueco en blanco así `""` para que el alumno lo rellene (valido tanto para operador como para operandos). Como referencia, cada fila ocupa 30px, osea 2 operandos mas el resultado, necesitaremos que la sección mida 90px'},
                { "role": "system", "content": '`circle`, `triangle`, `rectangle` tienen las propiedades `color`, `outlined` que son el color y si está rellenado o no'},
                { "role": "system", "content": 'Ejemplo de JSON: `{"height": 50, "title": "Ejemplo", "elements": "elements": {"basic_operation_v-1": {"id": "basic_operation_v-1", "type": "basic_operation_v", "operator": "-", "operands": [1000, 4], "result": "", "x": 10, "y": 20, "width": 20, "height": 30},"basic_operation_v-2": {"id": "basic_operation_v-2", "type": "basic_operation_v", "operator": "-", "operands": [35, 23], "result": "", "x": 50, "y": 20, "width": 20, "height": 30},"basic_operation_v-3": {"id": "basic_operation_v-3", "type": "basic_operation_v", "operator": "-", "operands": [50, 15], "result": "", "x": 90, "y": 20, "width": 20, "height": 30},"basic_operation_v-4": {"id": "basic_operation_v-4", "type": "basic_operation_v", "operator": "-", "operands": [192, 83], "result": "", "x": 130, "y": 20, "width": 20, "height": 30}}}`'},
                { "role": "user", "content": 'Genera un ejercicio para practicar las restas' },
                { "role": "assistant", "content": '{"height": 50, "title": "Ejemplo", "elements": "elements": {"basic_operation_v-1": {"id": "basic_operation_v-1", "type": "basic_operation_v", "operator": "-", "operands": [1000, 4], "result": "", "x": 10, "y": 20, "width": 20, "height": 30},"basic_operation_v-2": {"id": "basic_operation_v-2", "type": "basic_operation_v", "operator": "-", "operands": [35, 23], "result": "", "x": 50, "y": 20, "width": 20, "height": 30},"basic_operation_v-3": {"id": "basic_operation_v-3", "type": "basic_operation_v", "operator": "-", "operands": [50, 15], "result": "", "x": 90, "y": 20, "width": 20, "height": 30},"basic_operation_v-4": {"id": "basic_operation_v-4", "type": "basic_operation_v", "operator": "-", "operands": [192, 83], "result": "", "x": 130, "y": 20, "width": 20, "height": 30}}}' },
                { "role": "user", "content": prompt },
            ],
        });
        return response;
    } catch (error) {
        console.error("Error asking AI:", error);
        throw error;
    }
}