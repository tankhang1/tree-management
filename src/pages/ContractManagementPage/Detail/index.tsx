import React, { useState } from "react";
import {
  Button,
  Card,
  Group,
  Image,
  Modal,
  NumberInput,
  Select,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconArrowLeft,
  IconCalendar,
  IconCheck,
  IconEdit,
  IconPencil,
  IconPlant2,
  IconPlus,
  IconRefresh,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react";
import Scrollable from "../../../components/Scrollable";
import { useNavigate } from "react-router-dom";

// -------------------------------------------------------------
// Types
// -------------------------------------------------------------

type ContractItem = {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  spec?: string;
  img?: string;
};

type ContractForm = {
  code: string;
  name: string;
  signDate: Date | null;
  type: "Mua hàng" | "Bán hàng" | "Dịch vụ";
  isAppendix: boolean; // true = phụ lục
  mode: "Tiếng Việt" | "Song ngữ" | "English";
  items: ContractItem[]; // phân bón
  items_vehicle: ContractItem[]; // máy móc thiết bị
  partner?: string; // đối tác đã chọn (id hoặc tên)
  summary?: string;
};

// -------------------------------------------------------------
// Small helpers
// -------------------------------------------------------------
function SectionHeader({
  title,
  icon,
  right,
}: {
  title: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <Group justify="space-between" mb="xs">
      <Group>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        {icon && (
          <ThemeIcon variant="light" radius={4}>
            {icon}
          </ThemeIcon>
        )}

        <Title order={5}>{title}</Title>
      </Group>
      {right}
    </Group>
  );
}

function Labeled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Stack gap={4}>
      <Text c="dimmed" size="xs">
        {label}
      </Text>
      {children}
    </Stack>
  );
}

function ItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: ContractItem;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Card w={300} withBorder radius={4} shadow="xs" p="md">
      <Group wrap="nowrap" align="stretch">
        <Image
          src={item.img}
          w={100}
          h={100}
          fit="cover"
          radius={4}
          alt={item.name}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <Stack gap={4} flex={1} justify="space-between">
          <Stack gap={2}>
            <Title order={5}>{item.name}</Title>
            <Text size="sm">
              <b>Loại:</b> {item.category}
            </Text>
            <Text size="sm">
              <b>Số lượng:</b> {item.quantity} {item.unit}
            </Text>
            {item.spec && (
              <Text size="sm">
                <b>Quy cách:</b> {item.spec}
              </Text>
            )}
          </Stack>
          <Group gap={6}>
            <Button
              size="xs"
              radius={4}
              variant="light"
              leftSection={<IconPencil size={14} />}
              onClick={onEdit}
            >
              Sửa
            </Button>
            <Button
              radius={4}
              size="xs"
              variant="light"
              color="red"
              leftSection={<IconTrash size={14} />}
              onClick={onDelete}
            >
              Xoá
            </Button>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}

// -------------------------------------------------------------
// Main component
// -------------------------------------------------------------
const initial: ContractForm | null = {
  code: "HD-2025-AG-001",
  name: "HĐ Mua vật tư nông nghiệp vụ Hè Thu 2025",
  signDate: new Date("2025-08-20"), // <-- Date object
  type: "Mua hàng",
  isAppendix: false, // true nếu là Phụ lục
  mode: "Tiếng Việt",
  partner: "Công ty TNHH ABC",

  // Danh sách phân bón / vật tư
  items: [
    {
      name: "NPK 16-16-8",
      category: "Phân bón",
      quantity: 200,
      unit: "bao",
      spec: "50kg/bao",
      img: "data:image/jpeg;base64,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",
    },
    {
      name: "Urê 46%",
      category: "Phân bón",
      quantity: 150,
      unit: "bao",
      spec: "50kg/bao",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwQNmYMPEFxczPGYNYmbuCpgA7rGwe28gdwg&s",
    },
    {
      name: "DAP 18-46",
      category: "Phân bón",
      quantity: 100,
      unit: "bao",
      spec: "50kg/bao",
      img: "https://visanto.group/wp-content/uploads/2024/10/DAP-18-46-0_-VST-12.10.2024-02-600x600.png",
    },
    {
      name: "Kali Clorua (K2O 60%)",
      category: "Phân bón",
      quantity: 80,
      unit: "bao",
      spec: "50kg/bao",
      img: "https://hoachatquynhon.vn/wp-content/uploads/2023/09/Avata-hoachatquynhonvn-13.jpg",
    },
    {
      name: "Phân hữu cơ vi sinh",
      category: "Phân bón",
      quantity: 120,
      unit: "bao",
      spec: "25kg/bao",
      img: "https://songgianh.com.vn/upload/attachment/336vi-sinh-cc-sua.jpg",
    },
    {
      name: "Vôi Dolomite",
      category: "Cải tạo đất",
      quantity: 60,
      unit: "bao",
      spec: "25kg/bao",
      img: "https://voicanglong.com/watermark/product/570x570x1/upload/product/20241212-dolomite-moi-6528.jpg",
    },
  ],

  // Danh sách máy móc thiết bị
  items_vehicle: [
    {
      name: "Máy bơm tưới 3HP",
      category: "Thiết bị tưới",
      quantity: 3,
      unit: "cái",
      img: "https://bomnuoc.vn/uploads/files/2023/07/30/thumbs-509-328-0--1/may_bom_tuoi_tieu_maro_xgm6a.webp",
    },
    {
      name: "Máy phun thuốc 25L",
      category: "BVTV",
      quantity: 2,
      unit: "cái",
      img: "https://product.hstatic.net/200000373987/product/may-phun-thuoc__1__bbb41266967d418882a725ef29f79aea.jpg",
    },
    {
      name: "Ống PE tưới Φ16",
      category: "Vật tư tưới",
      quantity: 10,
      unit: "cuộn",
      img: "https://vnplant.vn/upload/images/ong-pe-16mm-day-12-bac.jpg",
    },
  ],

  summary:
    "Giao 2 đợt (03/2025 và 06/2025), giao tại kho TP.HCM. Thanh toán NET30, chiết khấu theo PL-2025-01. Hàng hóa kèm CO/CQ theo yêu cầu.",
}; // Replace with actual initial data if needed
export default function ContractManagementDetailPage() {
  const [form, setForm] = useState<ContractForm>({
    code: initial?.code ?? "HD-2025-001",
    name: initial?.name ?? "Hợp đồng mua vật tư nông nghiệp 2025",
    signDate: initial?.signDate ?? new Date(),
    type: (initial?.type as ContractForm["type"]) ?? "Mua hàng",
    isAppendix: initial?.isAppendix ?? false,
    mode: (initial?.mode as ContractForm["mode"]) ?? "Tiếng Việt",
    items: initial?.items ?? [
      {
        name: "NPK 16-16-8",
        category: "Phân bón",
        quantity: 200,
        unit: "bao",
        spec: "50kg/bao",
        img: "https://images.unsplash.com/photo-1524591347760-32536d8e2e72?q=80&w=500",
      },
      {
        name: "Ure 46%",
        category: "Phân bón",
        quantity: 150,
        unit: "bao",
        spec: "50kg/bao",
        img: "https://images.unsplash.com/photo-1607968565040-7682b2a7f22a?q=80&w=500",
      },
    ],
    items_vehicle: initial?.items_vehicle ?? [
      {
        name: "Máy bơm tưới 3HP",
        category: "Thiết bị tưới",
        quantity: 3,
        unit: "cái",
        img: "https://images.unsplash.com/photo-1635321677783-6f1b0d4f1b0c?q=80&w=500",
      },
    ],
    partner: initial?.partner ?? "Công ty TNHH ABC",
    summary:
      initial?.summary ??
      "Giao hàng theo 2 đợt (tháng 3 và 6/2025), thanh toán NET30, chiết khấu theo phụ lục PL-2025-01.",
  });

  // Editing state toggles
  const [editHeader, setEditHeader] = useState(false);
  const [editSummary, setEditSummary] = useState(false);

  // Item modals (fertilizer / vehicles)
  const [itemIndex, setItemIndex] = useState<number | null>(null);
  const [itemDraft, setItemDraft] = useState<ContractItem | null>(null);
  const [openItemModal, setOpenItemModal] = useState(false);

  const [vehIndex, setVehIndex] = useState<number | null>(null);
  const [vehDraft, setVehDraft] = useState<ContractItem | null>(null);
  const [openVehModal, setOpenVehModal] = useState(false);

  const openEditItem = (i: number) => {
    setItemIndex(i);
    setItemDraft(form.items[i]);
    setOpenItemModal(true);
  };
  const openNewItem = () => {
    setItemIndex(null);
    setItemDraft({
      name: "",
      category: "Phân bón",
      quantity: 0,
      unit: "bao",
      spec: "",
      img: "",
    });
    setOpenItemModal(true);
  };
  const saveItem = () => {
    if (!itemDraft) return;
    const next = [...form.items];
    if (itemIndex === null) next.push(itemDraft);
    else next[itemIndex] = itemDraft;
    setForm((f) => ({ ...f, items: next }));
    setOpenItemModal(false);
  };

  const openEditVeh = (i: number) => {
    setVehIndex(i);
    setVehDraft(form.items_vehicle[i]);
    setOpenVehModal(true);
  };
  const openNewVeh = () => {
    setVehIndex(null);
    setVehDraft({
      name: "",
      category: "Máy móc thiết bị",
      quantity: 0,
      unit: "cái",
      img: "",
    });
    setOpenVehModal(true);
  };
  const saveVeh = () => {
    if (!vehDraft) return;
    const next = [...form.items_vehicle];
    if (vehIndex === null) next.push(vehDraft);
    else next[vehIndex] = vehDraft;
    setForm((f) => ({ ...f, items_vehicle: next }));
    setOpenVehModal(false);
  };

  const resetAll = () => {
    setForm((f) => ({ ...f, signDate: new Date() }));
  };

  return (
    <Stack>
      {/* Header / Contract info */}
      <Card withBorder radius={4} p="md">
        <SectionHeader
          title="📌 Thông tin hợp đồng"
          right={
            !editHeader ? (
              <Group gap={8}>
                <Button
                  radius={4}
                  size="xs"
                  variant="light"
                  leftSection={<IconRefresh size={14} />}
                  onClick={resetAll}
                >
                  Đặt lại ngày ký
                </Button>
                <Button
                  radius={4}
                  size="xs"
                  leftSection={<IconEdit size={14} />}
                  onClick={() => setEditHeader(true)}
                >
                  Chỉnh sửa
                </Button>
              </Group>
            ) : (
              <Group gap={8}>
                <Button
                  radius={4}
                  size="xs"
                  variant="default"
                  onClick={() => setEditHeader(false)}
                >
                  Huỷ
                </Button>
                <Button
                  radius={4}
                  size="xs"
                  leftSection={<IconCheck size={14} />}
                  onClick={() => setEditHeader(false)}
                >
                  Lưu
                </Button>
              </Group>
            )
          }
        />

        {editHeader ? (
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Labeled label="Mã">
              <TextInput
                radius={4}
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.currentTarget.value })
                }
              />
            </Labeled>
            <Labeled label="Tên hợp đồng">
              <TextInput
                radius={4}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.currentTarget.value })
                }
              />
            </Labeled>
            <Labeled label="Ngày ký">
              <DateInput
                value={form.signDate}
                onChange={(d) => setForm({ ...form, signDate: d })}
                leftSection={<IconCalendar size={16} />}
              />
            </Labeled>
            <Labeled label="Loại">
              <Select
                radius={4}
                data={["Mua hàng", "Bán hàng", "Dịch vụ"]}
                value={form.type}
                onChange={(v) =>
                  setForm({
                    ...form,
                    type: (v as ContractForm["type"]) ?? "Mua hàng",
                  })
                }
              />
            </Labeled>
            <Labeled label="Phụ lục?">
              <Switch
                checked={form.isAppendix}
                onChange={(e) =>
                  setForm({ ...form, isAppendix: e.currentTarget.checked })
                }
                label={form.isAppendix ? "Có" : "Không"}
              />
            </Labeled>

            <Labeled label="Đối tác">
              <TextInput
                radius={4}
                placeholder="Tên/ID đối tác"
                value={form.partner ?? ""}
                onChange={(e) =>
                  setForm({ ...form, partner: e.currentTarget.value })
                }
              />
            </Labeled>
          </SimpleGrid>
        ) : (
          <Stack>
            <Text>
              <b>Mã:</b> {form.code}
            </Text>
            <Text>
              <b>Tên:</b> {form.name}
            </Text>
            <Text>
              <b>Ngày ký:</b> {form.signDate?.toLocaleDateString()}
            </Text>
            <Text>
              <b>Loại:</b> {form.type}
            </Text>
            <Text>
              <b>Kiểu:</b> {form.isAppendix ? "Phụ lục" : "Hợp đồng"}
            </Text>
            <Text>
              <b>Trình bày:</b> {form.mode}
            </Text>
            {form.partner && (
              <Text>
                <b>Đối tác:</b> {form.partner}
              </Text>
            )}
          </Stack>
        )}
      </Card>

      {/* Items: Phân bón */}
      <Card withBorder radius={4} p="md">
        <SectionHeader
          title="Danh sách hàng hoá — Phân bón"
          icon={<IconPlant2 size={18} />}
          right={
            <Button
              radius={4}
              size="xs"
              leftSection={<IconPlus size={14} />}
              onClick={openNewItem}
            >
              Thêm mặt hàng
            </Button>
          }
        />
        <Scrollable h={170}>
          <Group wrap="nowrap">
            {form.items.map((item, i) => (
              <ItemCard
                key={i}
                item={item}
                onEdit={() => openEditItem(i)}
                onDelete={() =>
                  setForm((f) => ({
                    ...f,
                    items: f.items.filter((_, idx) => idx !== i),
                  }))
                }
              />
            ))}
          </Group>
        </Scrollable>
      </Card>

      {/* Items: Máy móc thiết bị */}
      <Card withBorder radius={4} p="md">
        <SectionHeader
          title="Danh sách hàng hoá — Máy móc thiết bị"
          icon={<IconSettings size={18} />}
          right={
            <Button
              radius={4}
              size="xs"
              leftSection={<IconPlus size={14} />}
              onClick={openNewVeh}
            >
              Thêm thiết bị
            </Button>
          }
        />
        <Scrollable h={170}>
          <Group wrap="nowrap">
            {form.items_vehicle.map((item, i) => (
              <ItemCard
                key={i}
                item={item}
                onEdit={() => openEditVeh(i)}
                onDelete={() =>
                  setForm((f) => ({
                    ...f,
                    items_vehicle: f.items_vehicle.filter(
                      (_, idx) => idx !== i
                    ),
                  }))
                }
              />
            ))}
          </Group>
        </Scrollable>
      </Card>

      {/* Summary */}
      <Card withBorder radius={4} p="md">
        <SectionHeader
          title="Mô tả / Ghi chú"
          right={
            !editSummary ? (
              <Button
                radius={4}
                size="xs"
                leftSection={<IconEdit size={14} />}
                onClick={() => setEditSummary(true)}
              >
                Chỉnh sửa
              </Button>
            ) : (
              <Group gap={8}>
                <Button
                  radius={4}
                  size="xs"
                  variant="default"
                  onClick={() => setEditSummary(false)}
                >
                  Huỷ
                </Button>
                <Button
                  radius={4}
                  size="xs"
                  leftSection={<IconCheck size={14} />}
                  onClick={() => setEditSummary(false)}
                >
                  Lưu
                </Button>
              </Group>
            )
          }
        />
        {!editSummary ? (
          <Text size="sm">{form.summary || "—"}</Text>
        ) : (
          <Textarea
            value={form.summary}
            onChange={(e) =>
              setForm({ ...form, summary: e.currentTarget.value })
            }
            autosize
            minRows={3}
          />
        )}
      </Card>

      {/* -------------------- Modals -------------------- */}
      <Modal
        opened={openItemModal}
        onClose={() => setOpenItemModal(false)}
        title="Mặt hàng phân bón"
        size="lg"
      >
        {itemDraft && (
          <Stack>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                radius={4}
                label="Tên mặt hàng"
                value={itemDraft.name}
                onChange={(e) =>
                  setItemDraft({ ...itemDraft, name: e.currentTarget.value })
                }
                disabled
              />
              <TextInput
                radius={4}
                label="Loại"
                value={itemDraft.category}
                onChange={(e) =>
                  setItemDraft({
                    ...itemDraft,
                    category: e.currentTarget.value,
                  })
                }
                disabled
              />
              <NumberInput
                radius={4}
                label="Số lượng"
                value={itemDraft.quantity}
                onChange={(v) =>
                  setItemDraft({ ...itemDraft, quantity: Number(v) || 0 })
                }
                min={0}
              />
              <Select
                searchable
                clearable
                radius={4}
                label="Đơn vị"
                value={itemDraft.unit}
                data={[
                  { value: "kg", label: "Kilogram" },
                  { value: "litre", label: "Litre" },
                  { value: "piece", label: "Piece" },
                ]}
              />
              <Select radius={4} label="Quy cách" data={["Túi 10kg"]} />
            </SimpleGrid>
            <Group justify="flex-end">
              <Button
                radius={4}
                variant="default"
                onClick={() => setOpenItemModal(false)}
              >
                Huỷ
              </Button>
              <Button
                radius={4}
                leftSection={<IconCheck size={14} />}
                onClick={saveItem}
              >
                Lưu
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      <Modal
        opened={openVehModal}
        onClose={() => setOpenVehModal(false)}
        title={<Text>Thiết bị / máy móc</Text>}
        size="lg"
      >
        {vehDraft && (
          <Stack>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                radius={4}
                label="Tên thiết bị"
                value={vehDraft.name}
                onChange={(e) =>
                  setVehDraft({ ...vehDraft, name: e.currentTarget.value })
                }
                disabled
              />
              <TextInput
                radius={4}
                label="Loại"
                value={vehDraft.category}
                onChange={(e) =>
                  setVehDraft({ ...vehDraft, category: e.currentTarget.value })
                }
                disabled
              />
              <NumberInput
                radius={4}
                label="Số lượng"
                value={vehDraft.quantity}
                onChange={(v) =>
                  setVehDraft({ ...vehDraft, quantity: Number(v) || 0 })
                }
                min={0}
              />
              <TextInput
                radius={4}
                label="Đơn vị"
                value={vehDraft.unit}
                onChange={(e) =>
                  setVehDraft({ ...vehDraft, unit: e.currentTarget.value })
                }
              />
            </SimpleGrid>
            <Group justify="flex-end">
              <Button
                radius={4}
                variant="default"
                onClick={() => setOpenVehModal(false)}
              >
                Huỷ
              </Button>
              <Button
                radius={4}
                leftSection={<IconCheck size={14} />}
                onClick={saveVeh}
              >
                Lưu
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
