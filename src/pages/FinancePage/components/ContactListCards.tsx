import { Card, Stack, Text, Badge, Group } from "@mantine/core";
import { IconPhone, IconMail, IconUser } from "@tabler/icons-react";
import Scrollable from "../../../components/Scrollable";
import { contactList } from "../../ContactPage";
import { useState } from "react";

type ContactProps = {
  isMultiple?: boolean;
  isTouchable?: boolean;
};
export function ContactListCards({ isMultiple, isTouchable }: ContactProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const handleSelect = (id: string) => {
    if (!isTouchable) return;
    if (isMultiple) {
      setSelectedIds((prev) =>
        prev.includes(id)
          ? prev.filter((selectedId) => selectedId !== id)
          : [...prev, id]
      );
    } else {
      setSelectedIds([id]);
    }
  };
  return (
    <Scrollable h={200}>
      <Group wrap="nowrap" gap={"xs"} p={"xs"}>
        {contactList.map((contact) => (
          <Card
            key={contact.id}
            withBorder
            radius={4}
            shadow="sm"
            p="md"
            w={400}
            h={200}
            style={{
              cursor: isTouchable ? "pointer" : "default",
              borderColor: selectedIds.includes(contact.id)
                ? "green"
                : undefined,
              position: "relative",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = selectedIds.includes(e.id)
                ? "0 4px 8px rgba(76, 175, 80, 0.4)"
                : "0 2px 4px rgba(0, 0, 0, 0.1)";
            }}
            onClick={() => handleSelect(contact.id)}
          >
            <Stack gap="xs">
              <Group justify="space-between">
                <Text fw={600}>{contact.name}</Text>
                {contact.role && (
                  <Badge color="blue" variant="light">
                    {contact.role}
                  </Badge>
                )}
              </Group>

              <Group gap="xs">
                <IconPhone size={16} />
                <Text size="sm">{contact.phone}</Text>
              </Group>

              {contact.email && (
                <Group gap="xs">
                  <IconMail size={16} />
                  <Text size="sm">{contact.email}</Text>
                </Group>
              )}

              {contact.organization && (
                <Group gap="xs">
                  <IconUser size={16} />
                  <Text size="sm" c="dimmed">
                    {contact.organization}
                  </Text>
                </Group>
              )}

              {contact.address && (
                <Text size="sm" c="dimmed">
                  Địa chỉ: {contact.address}
                </Text>
              )}

              {contact.note && (
                <Text size="sm" c="dimmed" fs="italic">
                  Ghi chú: {contact.note}
                </Text>
              )}
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
}
