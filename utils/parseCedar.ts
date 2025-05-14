import * as z from "zod";

export async function parseCedar(cedarForm: any, answerForm: any | undefined): Promise<Form> {
  const _ui = cedarForm._ui;
  const properties = cedarForm.properties;

  let schema: any = {};
  let state: any = {};
  let ui: any = {};

  console.log("Cedar Form", cedarForm);

  for (let i = 0; i < _ui.order.length; i++) {
    const fieldId = _ui.order[i];

    const currentProp = properties[fieldId];

    // subform
    if (!currentProp._ui) {
      console.log("Subform", currentProp);
      const subform = await parseCedar(currentProp.items, answerForm);
      schema[fieldId] = { ... schema, ... subform.schema };
      state[fieldId] = { ... state, ... subform.state };
      ui[fieldId] = { ... ui, ... subform.ui };
      continue;
    }

    const type: string = currentProp?._ui?.inputType;

    const title: string = currentProp["schema:name"] ?? fieldId;
    const required: boolean =
      currentProp._valueConstraints?.requiredValue || false;
    const options =
      currentProp._valueConstraints?.literals?.map((l: any) => l.label) ?? [];

    let defaultValue: any = currentProp._valueConstraints?.defaultValue ?? null;

    if(answerForm && answerForm[fieldId]) {
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
        schema[fieldId] = z.string();
        if (currentProp._valueConstraints?.branches?.length) {
          // pull options from ontology
          const options = await fetchOptions(
            currentProp._valueConstraints.branches[0].uri
          );
          schema[fieldId] = z.string();
          ui[fieldId] = { label: title, inputType: "list", options, required };
        } else {
          // regular text field
          ui[fieldId] = {
            label: title,
            inputType: "text",
            baseInput: true,
            required,
          };
        }
        break;
      case "temporal":
        schema[fieldId] = z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid datetime",
        });
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
      case "numeric":
        schema[fieldId] = z.number();
        ui[fieldId] = {
          label: title,
          inputType: "number",
          baseInput: true,
          required,
        };
        break;
      case "radio":
        schema[fieldId] = z.string();
        ui[fieldId] = { label: title, inputType: "radio", options, required };
        break;
      case "list":
        schema[fieldId] = z.string();
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
