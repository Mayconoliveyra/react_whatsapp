import { Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import scheme from "../../../scheme";
export default function FormClientes() {
  function onSubmit(values, actions) {
    console.log(values);
    console.log(actions);
  }

  return (
    <div>
      <Formik
        onSubmit={onSubmit}
        validationSchema={scheme}
        initialValues={{
          nome: "",
          email: "",
        }}
      >
        {({ isValid }) => (
          <Form>
            <div>
              <label>Nome:</label>
              <Field name="nome" />
              <ErrorMessage name="nome" />
            </div>
            <div>
              <label>Email:</label>
              <Field name="email" />
              <ErrorMessage name="email" />
            </div>
            <Button type="submit" variant="primary" disabled={!isValid}>
              Enviar
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
