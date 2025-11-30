import { useState, useEffect } from "react";
import {
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Image,
  TextInput,
  Checkbox,
} from "@mantine/core";
import {
  useCertificateStore,
  type Certificate,
} from "../../../../zustand/certificateStore";
import Scrollable from "../../../../../components/Scrollable";

type CertificateId = Certificate["id"];

type CertificateCardListProps = {
  selected?: CertificateId[];
  onChange?: (ids: CertificateId[]) => void;
};

function CertificateCard({
  item,
  selected,
  onToggle,
}: {
  item: Certificate;
  selected: boolean;
  onToggle: (id: CertificateId) => void;
}) {
  return (
    <Card
      withBorder
      radius={4}
      padding="sm"
      h={140}
      className="relative"
      style={{
        borderWidth: 1,
        borderColor: selected ? "green" : undefined,
        cursor: "pointer",
        transition: "border-color .15s, box-shadow .15s, transform .05s",
      }}
      onClick={() => onToggle(item.id)}
    >
      <Group align="center" justify="flex-start">
        <Image
          src={item.orgLogo}
          h={100}
          w={"30%"}
          radius={4}
          alt={item.orgName}
          fit="scale-down"
        />

        <Stack flex={1} gap={6} mt="sm">
          <Group justify="space-between" align="center" wrap="nowrap">
            <Text fw={600}>{item.certName}</Text>
            <Checkbox
              radius={4}
              checked={selected}
              onChange={(e) => {
                e.stopPropagation();
                onToggle(item.id);
              }}
            />
          </Group>

          <Group gap={8} wrap="wrap">
            {item.certCode && <Badge variant="light">{item.certCode}</Badge>}
            {item.targets?.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </Group>

          <Text size="sm" c="dimmed">
            {item.orgName}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}

export default function CertificateCardList({
  selected,
  onChange,
}: CertificateCardListProps) {
  const { certificates } = useCertificateStore();
  const [internalSelected, setInternalSelected] = useState<CertificateId[]>(
    selected ?? []
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (selected) {
      setInternalSelected(selected);
    }
  }, [selected]);

  const toggle = (id: CertificateId) => {
    setInternalSelected((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];

      onChange?.(updated);
      return updated;
    });
  };

  const filtered = certificates.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return (
      item.certName.toLowerCase().includes(q) ||
      item.certCode?.toLowerCase().includes(q) ||
      item.orgName?.toLowerCase().includes(q)
    );
  });

  return (
    <Stack>
      <TextInput
        label="Giấy chứng nhận"
        radius={4}
        placeholder="Tìm kiếm giấy chứng nhận"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

      <Scrollable h={140}>
        <Group wrap="nowrap">
          {filtered.map((item) => (
            <CertificateCard
              key={item.id}
              item={item}
              selected={internalSelected.includes(item.id)}
              onToggle={toggle}
            />
          ))}
        </Group>
      </Scrollable>
    </Stack>
  );
}
