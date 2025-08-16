import { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Menu,
  Modal,
  Select,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEye,
  IconFileText,
  IconTrash,
  IconEdit,
  IconLink,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../../components/Table";

// --- Types ---
type Supplier = {
  id: string;
  name: string;
  phone: string;
  email: string;
  unit?: string;
  specification?: string;
  quantity?: number | string;
  note?: string;
};

type TechDoc = {
  kind: "pdf" | "html";
  title: string;
  url?: string;
  content?: string; // for html kind
};

type Material = {
  id: string;
  name: string;
  category: string; // Phân bón, Thuốc BVTV, Vật tư tưới, Bao bì, ...
  unit: string; // kg, lít, bao, cuộn...
  stock: number; // tồn kho hiện tại
  minStock: number; // ngưỡng cảnh báo sắp hết
  image?: string;
  suppliers?: Supplier[];
  technicalDocs?: TechDoc[];
  status?: "Còn hàng" | "Sắp hết" | "Hết hàng";
};

// --- Sample dataset (prefilled) ---
const materialsSeed: Material[] = [
  {
    id: "MT003",
    name: "Ống PE tưới nhỏ giọt Φ16",
    category: "Vật tư tưới",
    unit: "Cuộn (200m)",
    stock: 6,
    minStock: 5,
    image:
      "https://longduonggtec.com/image/catalog/T%C6%B0%E1%BB%9Bi%20c%E1%BA%A3nh%20quan/ong-dan-nuoc-pe-16mm.jpg",
    suppliers: [
      {
        id: "SUPA3",
        name: "IrrigaTech",
        phone: "+84 909 123 456",
        email: "cs@irrigatech.vn",
        unit: "Cuộn",
        specification: "PE 16mm dày 1.2mm",
        quantity: 10,
      },
    ],
    technicalDocs: [
      {
        kind: "pdf",
        title: "Catalogue ống PE",
        url: "https://admin.nhuatienphong.vn/img/products/catalog/CAT%20HDPE_Final.pdf",
      },
    ],
  },
  {
    id: "MT004",
    name: "Bao bì PP dệt (50kg)",
    category: "Bao bì",
    unit: "Bao",
    stock: 800,
    minStock: 200,
    image: "https://cokhi247.net/wp-content/uploads/2020/12/bao-tai-50kg.jpg",
    suppliers: [
      {
        id: "SUPA4",
        name: "Bao Bì An Phát",
        phone: "+84 28 5555 6666",
        email: "info@anphatpack.com",
        unit: "Bao",
        specification: "PP dệt, trong 3 lớp",
        quantity: 1000,
      },
    ],
    technicalDocs: [],
  },
  {
    id: "MT005",
    name: "Bẫy dính côn trùng vàng",
    category: "Vật tư bảo vệ",
    unit: "Tấm",
    stock: 0,
    minStock: 50,
    image:
      "https://file.hstatic.net/1000238788/file/keo-vang-bay-con-trung-israel-cho-hoa_ce8a9ac761b6405497fbc4e1e6a2fa06_master.jpg",
    suppliers: [
      {
        id: "SUPA5",
        name: "GreenShield",
        phone: "+84 28 2222 1111",
        email: "sales@greenshield.vn",
        unit: "Tấm",
        specification: "20x25cm, keo không độc",
        quantity: 500,
      },
    ],
    technicalDocs: [
      {
        kind: "html",
        title: "HDSD bẫy dính",
        content: "<p>Treo cách tán 10–20cm, mật độ 30–40 tấm/ha.</p>",
      },
    ],
  },
];

function getStatus(m: Material): Material["status"] {
  if (m.stock <= 0) return "Hết hàng";
  if (m.stock <= m.minStock) return "Sắp hết";
  return "Còn hàng";
}

function statusColor(status?: Material["status"]) {
  switch (status) {
    case "Còn hàng":
      return "green";
    case "Sắp hết":
      return "yellow";
    case "Hết hàng":
      return "red";
    default:
      return "gray";
  }
}

function TechDocModal({
  opened,
  onClose,
  docs,
}: {
  opened: boolean;
  onClose: () => void;
  docs?: TechDoc[];
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      radius={4}
      title={
        <Group gap={8}>
          <IconFileText size={18} />
          <Text fw={600}>Tài liệu kỹ thuật</Text>
        </Group>
      }
    >
      <Stack gap="sm">
        {(docs || []).length === 0 && <Text c="dimmed">Chưa có tài liệu.</Text>}
        {(docs || []).map((d, i) => (
          <Card key={i} withBorder radius={4} p="md">
            <Group justify="space-between" align="center">
              <Group gap={8}>
                <IconFileText size={18} />
                <Text fw={600}>{d.title}</Text>
                <Badge variant="light">{d.kind.toUpperCase()}</Badge>
              </Group>
              {d.url && (
                <Tooltip label="Mở tài liệu trong tab mới">
                  <ActionIcon
                    component="a"
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="subtle"
                  >
                    <IconEye size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
            {d.kind === "html" && d.content && (
              <Card.Section inheritPadding mt="sm">
                <div dangerouslySetInnerHTML={{ __html: d.content }} />
              </Card.Section>
            )}
            {d.kind === "pdf" && d.url && (
              <Card.Section inheritPadding mt="sm">
                <iframe
                  src={d.url}
                  width="100%"
                  height={360}
                  style={{
                    border: "1px solid var(--mantine-color-gray-3)",
                    borderRadius: 8,
                  }}
                />
              </Card.Section>
            )}
          </Card>
        ))}
      </Stack>
    </Modal>
  );
}

// --- Main list ---
export default function SupplyInfo() {
  const [materials] = useState<Material[]>(materialsSeed);

  const [docsModal, setDocsModal] = useState<{
    open: boolean;
    docs?: TechDoc[];
  }>({ open: false });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(materials.map((m) => m.category))),
    [materials]
  );

  const materialColumns: MRT_ColumnDef<Material>[] = [
    {
      accessorKey: "image",
      header: "Hình ảnh",
      Cell: ({ cell }) =>
        cell.getValue<string>() ? (
          <img src={cell.getValue<string>()} alt="Hình vật tư" width={48} />
        ) : null,
      size: 60,
    },
    { accessorKey: "name", header: "Tên vật tư" },
    { accessorKey: "category", header: "Phân loại" },
    {
      accessorKey: "stock",
      header: "Tồn kho",
      Cell: ({ row }) => {
        const m = row.original as Material;
        const st = getStatus(m);
        return (
          <Group gap={8}>
            <Text>{m.stock}</Text>
            <Badge size="sm" color={statusColor(st)} variant="light">
              {st}
            </Badge>
          </Group>
        );
      },
    },
    { accessorKey: "unit", header: "Đơn vị" },
    {
      accessorKey: "technicalDocs",
      header: "Tài liệu kỹ thuật",
      Cell: ({ row }) => (
        <Button
          variant="transparent"
          onClick={() =>
            setDocsModal({ open: true, docs: row.original.technicalDocs })
          }
          style={{ border: "none" }}
        >
          <Group>
            <IconLink size={18} />
            <Text>Tài liệu</Text>
          </Group>
        </Button>
      ),
    },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEye size={18} color="gray" />}>
              Chi tiết
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={18} />} color="red">
              Xoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const st = getStatus(m);
      const okCategory = selectedCategory
        ? m.category === selectedCategory
        : true;
      const okStatus = selectedStatus ? st === selectedStatus : true;
      return okCategory && okStatus;
    });
  }, [materials, selectedCategory, selectedStatus]);

  return (
    <Stack mt={"md"}>
      <Stack gap="xs">
        <Title order={3}>Danh sách vật tư nông nghiệp</Title>
        <Group>
          <Select
            placeholder="Phân loại"
            data={categories}
            clearable
            radius={4}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
          <Select
            placeholder="Trạng thái tồn kho"
            data={["Còn hàng", "Sắp hết", "Hết hàng"]}
            clearable
            radius={4}
            value={selectedStatus}
            onChange={setSelectedStatus}
          />
        </Group>
      </Stack>

      <Table data={filtered} columns={materialColumns} />

      <TechDocModal
        opened={docsModal.open}
        onClose={() => setDocsModal({ open: false })}
        docs={docsModal.docs}
      />
    </Stack>
  );
}
