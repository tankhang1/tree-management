import { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Group,
  Menu,
  Modal,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../../components/Table";

// (tuỳ chọn) tái dùng nếu bạn muốn mở modal quy cách đóng gói
type PackagingVariant = {
  quantity: number;
  packUnit: string; // bao, kg/bao, thùng…
  contentPerUnit: string; // 25kg, 50kg…
  note?: string;
};

type Fertilizer = {
  code: string; // Mã phân bón
  name: string; // Tên phân bón
  kind: "Vô cơ" | "Hữu cơ" | "Vi sinh" | "Khoáng hữu cơ";
  nutrients: string; // Hàm lượng dinh dưỡng (NPK 16-16-8, Đạm 46%…)
  unit: string; // Đơn vị bán/ghi nhận (kg, bao…)
  manufacturer: string; // Nhà sản xuất
  note?: string; // Ghi chú
  variants?: PackagingVariant[]; // (tuỳ chọn) các quy cách
};

const fertilizersSeed: Fertilizer[] = [
  {
    code: "F001",
    name: "Phân NPK tổng hợp",
    kind: "Vô cơ",
    nutrients: "NPK 16-16-8",
    unit: "kg",
    manufacturer: "Công ty Phân bón Miền Nam",
    note: "Phù hợp cho cây ăn trái và rau màu",
    variants: [
      { quantity: 100, packUnit: "bao", contentPerUnit: "50kg" },
      { quantity: 40, packUnit: "bao", contentPerUnit: "25kg" },
    ],
  },
  {
    code: "F002",
    name: "Phân hữu cơ vi sinh",
    kind: "Hữu cơ",
    nutrients: "Hữu cơ 30%",
    unit: "bao",
    manufacturer: "Công ty Hữu Cơ Việt",
    note: "Cải tạo đất, tăng độ tơi xốp",
    variants: [{ quantity: 120, packUnit: "bao", contentPerUnit: "25kg" }],
  },
  {
    code: "F003",
    name: "Phân Urê",
    kind: "Vô cơ",
    nutrients: "Đạm 46%",
    unit: "kg",
    manufacturer: "Đạm Phú Mỹ",
    note: "Cung cấp đạm giai đoạn phát triển thân lá",
    variants: [{ quantity: 60, packUnit: "bao", contentPerUnit: "50kg" }],
  },
  {
    code: "F004",
    name: "Phân NPK 20-20-15+TE",
    kind: "Vô cơ",
    nutrients: "NPK 20-20-15 + TE",
    unit: "bao",
    manufacturer: "Bình Điền",
    note: "Bón thúc, tăng đậu trái",
  },
  {
    code: "F005",
    name: "Phân hữu cơ khoáng",
    kind: "Khoáng hữu cơ",
    nutrients: "HC 20% + Khoáng 15%",
    unit: "bao",
    manufacturer: "GreenAgri",
    note: "Cải tạo đất + bổ sung khoáng",
  },
];

const KIND_COLOR: Record<Fertilizer["kind"], string> = {
  "Vô cơ": "blue",
  "Hữu cơ": "green",
  "Vi sinh": "grape",
  "Khoáng hữu cơ": "teal",
};

export default function FertilizerInfo() {
  const [kind, setKind] = useState<Fertilizer["kind"] | null>(null);

  // (tuỳ chọn) modal xem quy cách
  const [variantModal, setVariantModal] = useState<{
    open: boolean;
    name?: string;
    variants?: PackagingVariant[];
  }>({ open: false });

  const columns: MRT_ColumnDef<Fertilizer>[] = [
    { accessorKey: "code", header: "Mã phân bón", size: 80 },
    { accessorKey: "name", header: "Tên phân bón", size: 220 },
    {
      accessorKey: "kind",
      header: "Loại",
      size: 100,
      Cell: ({ cell }) => {
        const v = cell.getValue<Fertilizer["kind"]>();
        return (
          <Badge variant="light" color={KIND_COLOR[v]}>
            {v}
          </Badge>
        );
      },
    },
    { accessorKey: "nutrients", header: "Hàm lượng dinh dưỡng", size: 180 },
    { accessorKey: "manufacturer", header: "Nhà sản xuất", size: 220 },
    { accessorKey: "note", header: "Ghi chú", size: 240 },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      size: 10,
      enableColumnActions: false,
      Cell: ({ row }) => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c="gray">
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() =>
                setVariantModal({
                  open: true,
                  name: row.original.name,
                  variants: row.original.variants,
                })
              }
            >
              Quy cách/đóng gói
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

  const variantColumns: MRT_ColumnDef<PackagingVariant>[] = [
    { accessorKey: "quantity", header: "Số lượng", size: 80 },
    { accessorKey: "packUnit", header: "Đơn vị", size: 100 },
    {
      accessorKey: "contentPerUnit",
      header: "Quy cách (mỗi đơn vị)",
      size: 160,
    },
    { accessorKey: "note", header: "Ghi chú", size: 200 },
  ];

  const data = useMemo(() => {
    const q = "";
    return fertilizersSeed.filter((f) => {
      const okKind = kind ? f.kind === kind : true;
      const okQuery =
        !q ||
        f.code.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q) ||
        f.nutrients.toLowerCase().includes(q) ||
        f.manufacturer.toLowerCase().includes(q) ||
        (f.note ?? "").toLowerCase().includes(q);
      return okKind && okQuery;
    });
  }, [kind]);

  return (
    <Stack mt="md">
      <Title order={3}>Danh sách phân bón</Title>
      <Group wrap="wrap">
        <Select
          searchable
          clearable
          placeholder="Lọc theo loại"
          data={["Vô cơ", "Hữu cơ", "Vi sinh", "Khoáng hữu cơ"]}
          value={kind}
          onChange={(v) => setKind((v as Fertilizer["kind"]) ?? null)}
          radius={4}
          w={220}
        />
      </Group>

      <Table data={data} columns={columns} />

      <Modal
        opened={variantModal.open}
        onClose={() => setVariantModal({ open: false })}
        size="lg"
        radius={4}
        title={
          <Group gap={8}>
            <Text fw={600}>{variantModal.name}</Text>
          </Group>
        }
      >
        <Table data={variantModal.variants ?? []} columns={variantColumns} />
      </Modal>
    </Stack>
  );
}
