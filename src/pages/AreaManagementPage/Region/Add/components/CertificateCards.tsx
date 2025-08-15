import { useState } from "react";
import {
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Image,
  Avatar,
  Tooltip,
  TextInput,
  Checkbox,
} from "@mantine/core";
import { IconCertificate } from "@tabler/icons-react";

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

const ITEMS: CertificateItem[] = [
  {
    id: 1,
    title: "Chứng nhận VietGAP",
    code: "GCN-VG-2025-001",
    org: "Tổ chức VietGAP",
    thumb:
      "https://vnce.vn/Uploads/images/chung-nhan-hop-chuan/chung-nhan-vietgap-san-pham.jpg",
    seal: "https://sutech.vn/wp-content/uploads/2021/09/logo-vietgap-chan-nuoi.jpg",
    tags: ["Cây trồng", "Phổ biến"],
  },
  {
    id: 2,
    title: "GlobalG.A.P.",
    code: "GG-2025-013",
    org: "GLOBALG.A.P.",
    thumb:
      "https://clv.vn/wp-content/uploads/2023/08/tong-quan-ve-global-gap-1.jpg",
    seal: "https://natekvn.com/public/upload/images/GGAP.jpg",
    tags: ["Quốc tế"],
  },
  {
    id: 3,
    title: "Hữu cơ (Organic)",
    code: "ORG-2025-009",
    org: "Tổ chức Organic",
    thumb: "https://knacert.com.vn/storage/chung-nhan-organic.jpg",
    tags: ["Organic"],
  },
];

// ===== Card component =====
function CertificateCard({
  item,
  selected,
  onToggle,
}: {
  item: CertificateItem;
  selected: boolean;
  onToggle: (id: CertificateItem["id"]) => void;
}) {
  return (
    <Card
      withBorder
      radius={4}
      padding="sm"
      className="relative"
      style={{
        borderWidth: 1,
        borderColor: selected ? "green" : undefined,
        cursor: "pointer",
        transition: "border-color .15s, box-shadow .15s, transform .05s",
      }}
      onClick={() => onToggle(item.id)}
    >
      {/* Thumb */}
      <div style={{ position: "relative" }}>
        {item.thumb ? (
          <Image
            src={item.thumb}
            height={120}
            radius={4}
            alt={item.title}
            fit="revert"
          />
        ) : (
          <Card
            radius="md"
            withBorder
            style={{ height: 120, display: "grid", placeItems: "center" }}
          >
            <IconCertificate size={28} />
          </Card>
        )}

        {/* Seal (dấu mộc) overlay ở góc */}
        {item.seal && (
          <Tooltip label="Dấu chứng nhận" withArrow>
            <Avatar
              src={item.seal}
              alt="seal"
              radius="xl"
              style={{
                position: "absolute",
                right: 8,
                bottom: 8,
                border: "2px solid white",
              }}
            />
          </Tooltip>
        )}
      </div>

      <Stack gap={6} mt="sm">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Text fw={600} lineClamp={1}>
            {item.title}
          </Text>
          <Checkbox radius={4} checked={selected} />
        </Group>
        <Group gap={8} wrap="wrap">
          <Badge variant="light">{item.code}</Badge>
          {item.tags?.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </Group>
        <Text size="sm" c="dimmed" lineClamp={1}>
          {item.org}
        </Text>
      </Stack>
    </Card>
  );
}

// ===== Main list (multiple select) =====
export default function CertificateCardList() {
  const [selected, setSelected] = useState<Array<CertificateItem["id"]>>([]);

  const toggle = (id: CertificateItem["id"]) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <Stack>
      <TextInput
        label="Giấy chứng nhận"
        radius={4}
        placeholder="Tìm kiếm giấy chứng nhận"
      />

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {ITEMS.map((item) => (
          <CertificateCard
            key={item.id}
            item={item}
            selected={selected.includes(item.id)}
            onToggle={toggle}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
