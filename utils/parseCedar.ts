import * as z from "zod";

export async function parseCedar(cedarForm: any, answerForm: any | undefined): Promise<Form> {
  const _ui = cedarForm._ui;
  const properties = cedarForm.properties;

  let schema: any = {};
  let state: any = {};
  let ui: any = {};

  for (let i = 0; i < _ui.order.length; i++) {
    const fieldId = _ui.order[i];

    let currentProp = properties[fieldId];

    // // subform
    if (currentProp['type'] == "array") {
      currentProp = currentProp["items"];
    //   // console.log("Subform", currentProp);
    //   const subform = await parseCedar(currentProp.items, answerForm);
    //   schema[fieldId] = { ... schema, ... subform.schema };
    //   state[fieldId] = { ... state, ... subform.state };
    //   ui[fieldId] = { ... ui, ... subform.ui };
    //   continue;
    }

    const type: string = currentProp?._ui?.inputType;

    // const title: string = currentProp["skos:prefLabel"] ?? (currentProp["schema:name"] ?? fieldId);
    const title: string = currentProp["skos:prefLabel"]
    const required: boolean =
      currentProp._valueConstraints?.requiredValue || false;
    const options =
      currentProp._valueConstraints?.literals?.map((l: any) => l.label) ?? [];

    let defaultValue: any = currentProp._valueConstraints?.defaultValue ?? null;

    if(type == "checkbox") {
      defaultValue = [];
    }

    if(type == "textarea" || type == "textfield" || type == "radio" || type == "list" || type == "temporal") {
      defaultValue = "";
    }

    if(answerForm && answerForm[fieldId] !== undefined && answerForm[fieldId] !== null) {
      defaultValue = answerForm[fieldId];
    }

    switch (type) {
      case "section-break":
        schema[fieldId] = z.string();
        ui[fieldId] = {
          label: title,
          inputType: "section-break",
        };
        break;
      case "textfield":
        if (currentProp._valueConstraints?.branches?.length) {
          // pull options from ontology
          const options = await fetchOptions(
            currentProp._valueConstraints.branches[0].uri
          );
          if (required) {
            schema[fieldId] = z.string({ required_error: "This field is required" }).min(1, "This field is required");
          } else {
            schema[fieldId] = z.string().optional();
          }
          ui[fieldId] = { label: title, inputType: "list", options, required };
        } else {
          // regular text field
          if (required) {
            schema[fieldId] = z.string({ required_error: "This field is required" }).min(1, "This field is required");
          } else {
            schema[fieldId] = z.string().optional();
          }
          ui[fieldId] = {
            label: title,
            inputType: "text",
            baseInput: true,
            required,
          };
        }
        break;
      case "temporal":
        if (required) {
          schema[fieldId] = z.string({ required_error: "This field is required" }).min(1, "This field is required").refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid datetime",
          });
        } else {
          schema[fieldId] = z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid datetime",
          }).optional();
        }
        ui[fieldId] = {
          inputType: "datetime-local",
          label: title,
          baseInput: true,
          required,
        };
        break;
      case "email":
        if (required) schema[fieldId] = z.string().email();
        else schema[fieldId] = z.string().email().optional();
        ui[fieldId] = {
          label: title,
          inputType: "email",
          baseInput: true,
          required,
        };
        break;
      case "richtext":
        schema[fieldId] = z
          .string()
          .min(10, "Must be at least 10 characters long");
        ui[fieldId] = {
          label: title,
          inputType: "text",
          baseInput: true,
          required,
        };
        break;
      case "textarea":
        if (required) {
          schema[fieldId] = z.string({ required_error: "This field is required" }).min(1, "This field is required");
        } else {
          schema[fieldId] = z.string().optional();
        }
        ui[fieldId] = {
          label: title,
          inputType: "textarea",
          baseInput: false,
          required,
        };
        break;
      case "numeric":
        if (required) {
          schema[fieldId] = z.number({
            required_error: "This field is required",
            invalid_type_error: "Must be a number"
          });
        } else {
          schema[fieldId] = z.number().optional();
        }
        ui[fieldId] = {
          label: title,
          inputType: "number",
          baseInput: true,
          required,
        };
        break;
      case "radio":
        if (required) {
          schema[fieldId] = z.string({ required_error: "This field is required" }).min(1, "This field is required");
        } else {
          schema[fieldId] = z.string().optional();
        }
        ui[fieldId] = { label: title, inputType: "radio", options, required };
        break;
      case "checkbox":
        if (required) {
          schema[fieldId] = z.string().array().min(1, "At least one option is required");
        } else {
          schema[fieldId] = z.string().array();
        }
        ui[fieldId] = { label: title, inputType: "checkbox", options, required };
        break;
      case "list":
        if (required) {
          schema[fieldId] = z.string({ required_error: "This field is required" }).min(1, "This field is required");
        } else {
          schema[fieldId] = z.string().optional();
        }
        ui[fieldId] = { label: title, inputType: "list", options, required };
        break;
      default:
        schema[fieldId] = z.unknown();
        break;
    }

    state[fieldId] = defaultValue;
  }

  return { schema, state, ui };
}

const fetchOptions = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching options:", error);
    return ["Test1", "Test2", "Test3"];
  }
};
