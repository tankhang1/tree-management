import { useState } from "react";
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

// ===== Types & mock =====
export type CertificateItem = {
  id: string | number;
  title: string;
  code: string;
  org: string;
  thumb?: string; // ảnh minh hoạ giấy chứng nhận
  seal?: string; // ảnh dấu mộc/chứng nhận
  tags?: string[];
};

// ===== Card component =====
function CertificateCard({
  item,
  selected,
  onToggle,
}: {
  item: Certificate;
  selected: boolean;
  onToggle: (id: Certificate["id"]) => void;
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

            {/* STOP PROPAGATION để Checkbox không click vào Card */}
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
            <Badge variant="light">{item.certCode}</Badge>
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
  onSelectedChange,
}: {
  onSelectedChange?: (ids: Array<Certificate["id"]>) => void;
}) {
  const { certificates } = useCertificateStore();
  const [selected, setSelected] = useState<Array<Certificate["id"]>>([]);
  const [search, setSearch] = useState("");

  const toggle = (id: Certificate["id"]) => {
    setSelected((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];

      // 🔥 Bắn callback ra ngoài
      onSelectedChange?.(updated);

      return updated;
    });
  };

  const filtered = certificates.filter((item) => {
    const q = search.trim().toLowerCase();

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
        onChange={(e) => setSearch(e.target.value)}
      />

      <Scrollable h={140}>
        <Group wrap="nowrap">
          {filtered.map((item) => (
            <CertificateCard
              key={item.id}
              item={item}
              selected={selected.includes(item.id)}
              onToggle={toggle}
            />
          ))}
        </Group>
      </Scrollable>
    </Stack>
  );
}
