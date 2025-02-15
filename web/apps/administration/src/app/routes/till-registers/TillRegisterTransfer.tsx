import * as React from "react";
import { useTranslation } from "react-i18next";
import { Paper, LinearProgress, Button, Typography, Alert, AlertTitle } from "@mui/material";
import { Formik, FormikHelpers, Form } from "formik";
import { selectTillRegisterById, useGetTillRegistersQuery, useTransferRegisterMutation } from "@api";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Loading } from "@stustapay/components";
import { toFormikValidationSchema } from "@stustapay/utils";
import { UserSelect } from "@components";
import { z } from "zod";

const TillTransferSchema = z.object({
  target_cashier_id: z.number().int(),
});

type FormValues = z.infer<typeof TillTransferSchema>;

export const TillRegisterTransfer: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { registerId } = useParams();
  const { register, isLoading, error } = useGetTillRegistersQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      ...rest,
      register: data ? selectTillRegisterById(data, Number(registerId)) : undefined,
    }),
  });
  const [transferRegister] = useTransferRegisterMutation();

  const initialValues: FormValues = React.useMemo(() => {
    return {
      target_cashier_id: register?.current_cashier_id ?? -1,
    };
  }, [register]);

  if (error) {
    return <Navigate to="/till-registers" />;
  }

  if (isLoading || !register) {
    return <Loading />;
  }

  const handleSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    if (register.current_cashier_id == null) {
      return;
    }
    setSubmitting(true);

    transferRegister({ source_cashier_id: register.current_cashier_id, ...values })
      .unwrap()
      .then(() => {
        setSubmitting(false);
        navigate("/till-registers");
      })
      .catch((err) => {
        setSubmitting(false);
        console.warn("error in till register stocking update", err);
      });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t("register.transfer")}
      </Typography>
      {register.current_cashier_id == null ? (
        <Alert severity="error">
          <AlertTitle>{t("register.cannotTransferNotAssigned")}</AlertTitle>
        </Alert>
      ) : (
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={toFormikValidationSchema(TillTransferSchema)}
        >
          {({ values, handleSubmit, isSubmitting, setFieldValue, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <UserSelect
                variant="standard"
                label={t("register.transferTargetCashier")}
                value={values.target_cashier_id}
                onChange={(newVal) => setFieldValue("target_cashier_id", newVal)}
                filterRole="cashier"
                error={touched.target_cashier_id && !!errors.target_cashier_id}
                helperText={(touched.target_cashier_id && errors.target_cashier_id) as string}
              />

              {isSubmitting && <LinearProgress />}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 1 }}
              >
                {t("submit")}
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Paper>
  );
};
