import { Button, Typography } from "@humansignal/ui";
import { Space } from "@humansignal/ui/lib/space/space";
import { cn } from "apps/labelstudio/src/utils/bem";
import { Modal } from "apps/labelstudio/src/components/Modal/ModalPopup";
import { API } from "apps/labelstudio/src/providers/ApiProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "../../../components/Form";

export function InviteLink({
  opened,
  orgId,
  onOpened,
  onClosed,
}: {
  opened: boolean;
  orgId: number;
  onOpened?: () => void;
  onClosed?: () => void;
}) {
  const modalRef = useRef<Modal>();
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    if (opened && !link) {
      API.invoke("orgInviteLink", { pk: orgId }).then((result) => {
        if (result?.invite_url) setLink(location.origin + result.invite_url);
      });
    }
  }, [opened, orgId]);

  useEffect(() => {
    if (modalRef.current && opened) {
      modalRef.current?.show?.();
    } else if (modalRef.current && modalRef.current.visible) {
      modalRef.current?.hide?.();
    }
  }, [opened]);

  const handleReset = async () => {
    const result = await API.invoke("resetOrgInviteLink", { pk: orgId });
    if (result?.invite_url) setLink(location.origin + result.invite_url);
  };

  return (
    <Modal
      ref={modalRef}
      title="Invite members"
      opened={opened}
      bareFooter={true}
      body={<InvitationModal link={link} />}
      footer={<InvitationFooter link={link} onReset={handleReset} />}
      style={{ width: 640, height: 472 }}
      onHide={onClosed}
      onShow={onOpened}
    />
  );
}

const InvitationModal = ({ link }: { link: string | null }) => {
  return (
    <div className={cn("invite").toClassName()}>
      <Input value={link ?? ""} style={{ width: "100%" }} readOnly />
      <Typography size="small" className="text-neutral-content-subtler mt-base mb-wider">
        Invite members to join your Label Studio instance. People that you invite have full access to all of your
        projects.{" "}
        <a
          href="https://labelstud.io/guide/signup.html"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
          onClick={() =>
            __lsa("docs.organization.add_people.learn_more", {
              href: "https://labelstud.io/guide/signup.html",
            })
          }
        >
          Learn more
        </a>
        .
      </Typography>
    </div>
  );
};

const InvitationFooter = ({ link, onReset }: { link: string | null; onReset: () => void }) => {
  const { copyText, copied } = useTextCopy();

  return (
    <Space spread>
      <Space>
        <Button
          variant="negative"
          look="outlined"
          style={{ width: 170 }}
          onClick={onReset}
          aria-label="Refresh invite link"
        >
          Reset Link
        </Button>
      </Space>
      <Space>
        <Button
          variant={copied ? "positive" : "primary"}
          className="w-[170px]"
          onClick={() => link && copyText(link)}
          aria-label="Copy invite link"
        >
          {copied ? "Copied!" : "Copy link"}
        </Button>
      </Space>
    </Space>
  );
};

function useTextCopy() {
  const [copied, setCopied] = useState(false);

  const copyText = useCallback((value: string) => {
    setCopied(true);
    navigator.clipboard.writeText(value ?? "");
    setTimeout(() => setCopied(false), 1500);
  }, []);

  return { copied, copyText };
}
