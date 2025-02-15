import { Paper, TextField, Button, LinearProgress, Typography, Tab, Box } from "@mui/material";
import * as React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { toFormikValidationSchema } from "@stustapay/utils";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { MutationActionCreatorResult } from "@reduxjs/toolkit/dist/query/core/buildInitiate";
import { NewTillLayout } from "@stustapay/models";
import { TillLayoutDesigner } from "./TillLayoutDesigner";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { selectTicketAll, selectTillButtonAll, useGetTicketsQuery, useGetTillButtonsQuery } from "@api";
import { Loading } from "@stustapay/components";

export interface TillChangeProps<T extends NewTillLayout> {
  headerTitle: string;
  submitLabel: string;
  initialValues: T;
  validationSchema: z.ZodSchema<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (t: T) => MutationActionCreatorResult<any>;
}

export function TillLayoutChange<T extends NewTillLayout>({
  headerTitle,
  submitLabel,
  initialValues,
  validationSchema,
  onSubmit,
}: TillChangeProps<T>) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { buttons } = useGetTillButtonsQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      ...rest,
      buttons: data ? selectTillButtonAll(data) : undefined,
    }),
  });
  const { tickets } = useGetTicketsQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      ...rest,
      tickets: data ? selectTicketAll(data) : undefined,
    }),
  });

  const [selectedTab, setSelectedTab] = React.useState<"buttons" | "tickets">("buttons");

  if (!tickets || !buttons) {
    return <Loading />;
  }

  const handleSubmit = (values: T, { setSubmitting }: FormikHelpers<T>) => {
    setSubmitting(true);

    onSubmit(values)
      .unwrap()
      .then(() => {
        setSubmitting(false);
        navigate("/till-layouts");
      })
      .catch((err) => {
        setSubmitting(false);
        console.warn("error in till update", err);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={toFormikValidationSchema(validationSchema)}
    >
      {({ values, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, errors, touched }) => (
        <Form onSubmit={handleSubmit}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5">{headerTitle}</Typography>
            <TextField
              variant="standard"
              margin="normal"
              fullWidth
              autoFocus
              name="name"
              label={t("layout.name")}
              error={touched.name && !!errors.name}
              helperText={(touched.name && errors.name) as string}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
            />

            <TextField
              variant="standard"
              margin="normal"
              fullWidth
              name="description"
              label={t("layout.description")}
              error={touched.description && !!errors.description}
              helperText={(touched.description && errors.description) as string}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description}
            />
          </Paper>
          <Paper sx={{ mt: 2 }}>
            <TabContext value={selectedTab}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList onChange={(evt, val) => setSelectedTab(val as any)}>
                  <Tab value="buttons" label={t("layout.buttons")} />
                  <Tab value="tickets" label={t("layout.tickets")} />
                </TabList>
              </Box>
              <TabPanel value="buttons">
                <TillLayoutDesigner
                  selectedIds={values.button_ids === null ? [] : values.button_ids}
                  onChange={(buttonIds) => setFieldValue("button_ids", buttonIds)}
                  selectables={buttons}
                />
              </TabPanel>
              <TabPanel value="tickets">
                <TillLayoutDesigner
                  selectedIds={values.ticket_ids === null ? [] : values.ticket_ids}
                  onChange={(ticketIds) => setFieldValue("ticket_ids", ticketIds)}
                  selectables={tickets.map((t) => ({ id: t.id, name: t.name, price: t.total_price }))}
                />
              </TabPanel>
            </TabContext>
          </Paper>
          <Paper sx={{ mt: 2, p: 2 }}>
            {isSubmitting && <LinearProgress />}
            <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting} sx={{ mt: 1 }}>
              {submitLabel}
            </Button>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}
