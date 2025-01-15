export default {
    "_id": "template-notas-pentagrama",
    "_type": "blank",
    "_height": 300,
    "_title": "Escribe el nombre de cada nota debajo de su posición en el pentagrama.",
    "_elements": {
        "pentagrama": {
            "_id": "pentagrama",
            "_x": 22,
            "_y": 107,
            "_width": 600,
            "_height": 120,
            "_type": "free_form_svg",
            "_style": {},
            "_firstPlacement": false,
            "_content": {
                "type": "g",
                "key": null,
                "ref": null,
                "props": {
                    "dangerouslySetInnerHTML": {
                        "__html": "<g>\n        <line x1=\"0\" y1=\"20\" x2=\"600\" y2=\"20\" stroke=\"black\" stroke-width=\"2\"/>\n        <line x1=\"0\" y1=\"40\" x2=\"600\" y2=\"40\" stroke=\"black\" stroke-width=\"2\"/>\n        <line x1=\"0\" y1=\"60\" x2=\"600\" y2=\"60\" stroke=\"black\" stroke-width=\"2\"/>\n        <line x1=\"0\" y1=\"80\" x2=\"600\" y2=\"80\" stroke=\"black\" stroke-width=\"2\"/>\n        <line x1=\"0\" y1=\"100\" x2=\"600\" y2=\"100\" stroke=\"black\" stroke-width=\"2\"/>\n        <circle cx=\"150\" cy=\"60\" r=\"10\" fill=\"black\"/>\n        <circle cx=\"300\" cy=\"80\" r=\"10\" fill=\"black\"/>\n         <circle cx=\"450\" cy=\"40\" r=\"10\" fill=\"black\"/>\n      </g>"
                    }
                },
                "_owner": null
            }
        },
        "text_do": {
            "_id": "text_do",
            "_x": 142,
            "_y": 233,
            "_width": 85,
            "_height": 30,
            "_type": "text",
            "_style": {},
            "_firstPlacement": false,
            "_text": "___<span>____</span>"
        },
        "text_mi": {
            "_id": "text_mi",
            "_x": 293,
            "_y": 234,
            "_width": 50,
            "_height": 30,
            "_type": "text",
            "_style": {},
            "_firstPlacement": false,
            "_text": "_<span>____</span>__"
        },
        "text_sol": {
            "_id": "text_sol",
            "_x": 441,
            "_y": 231,
            "_width": 50,
            "_height": 30,
            "_type": "text",
            "_style": {},
            "_firstPlacement": false,
            "_text": "<span>____</span>___"
        }
    }
}
