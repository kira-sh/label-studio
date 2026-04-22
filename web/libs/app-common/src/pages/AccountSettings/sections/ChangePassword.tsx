import { type FormEventHandler, useCallback, useState } from "react";
import { Button, ToastType, useToast } from "@humansignal/ui";
import { getApiInstance } from "@humansignal/core";

/**
 * FIXME: This is legacy imports. We're not supposed to use such statements
 * each one of these eventually has to be migrated to core or ui
 */
import { Input } from "apps/labelstudio/src/components/Form/Elements";
import styles from "../AccountSettings.module.css";

export const ChangePassword = () => {
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isInProgress, setIsInProgress] = useState(false);

  const handleSubmit: FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (password !== confirm) {
        toast?.show({ message: "Passwords do not match.", type: ToastType.error });
        return;
      }
      setIsInProgress(true);
      const api = getApiInstance();
      const result = await api.invoke("setPassword", {}, { body: { password } });
      setIsInProgress(false);
      if (result?.$meta?.ok) {
        toast?.show({ message: "Password updated successfully.", type: ToastType.success });
        setPassword("");
        setConfirm("");
      } else {
        const message = result?.response?.error ?? "Failed to update password.";
        toast?.show({ message, type: ToastType.error });
      }
    },
    [password, confirm],
  );

  return (
    <div className={styles.section} id="change-password">
      <form onSubmit={handleSubmit} className={styles.sectionContent}>
        <div className={styles.flexRow}>
          <div className={styles.flex1}>
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              name="password"
              required
            />
          </div>
          <div className={styles.flex1}>
            <Input
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
              name="confirm"
              required
            />
          </div>
        </div>
        <div className={`${styles.flexRow} ${styles.flexEnd}`}>
          <Button style={{ width: 125 }} waiting={isInProgress} disabled={!password || !confirm}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
