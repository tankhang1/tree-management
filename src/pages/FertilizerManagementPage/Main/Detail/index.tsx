import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Image,
  Input,
  Modal,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconEdit,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
  IconCheck,
  IconExternalLink,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Scrollable from "../../../../components/Scrollable";
import { SelectableSupplierCards } from "../../../SupplyManagementPage/Add/components/SelectableSupplierCards";
import { companies } from "../../../SupplyManagementPage/Add";

type PackageItem = {
  id: string;
  unit: string;
  specification: string;
  quantity: number;
  note?: string;
};
type DocItem = { title: string; url: string };
type PriceTier = {
  channel: string;
  currency: string;
  price: number;
  minQty: number;
  vat: number;
  discount?: number;
};

const defaultPackages: PackageItem[] = [
  { id: "PKG-25KG", unit: "Bao", specification: "Bao 25kg", quantity: 120 },
  { id: "PKG-50KG", unit: "Bao", specification: "Bao 50kg", quantity: 60 },
  { id: "PKG-1KG", unit: "Bịch", specification: "Bịch 1kg", quantity: 500 },
];

const defaultDocs: DocItem[] = [
  { title: "CO - Chứng nhận xuất xứ", url: "#" },
  { title: "CQ - Chứng nhận chất lượng", url: "#" },
  { title: "MSDS - An toàn hóa chất", url: "#" },
];

const defaultTiers: PriceTier[] = [
  {
    channel: "Bán lẻ",
    currency: "VND",
    price: 320000,
    minQty: 1,
    vat: 8,
    discount: 0,
  },
  {
    channel: "Sỉ khu vực",
    currency: "VND",
    price: 300000,
    minQty: 50,
    vat: 8,
    discount: 5,
  },
  {
    channel: "Đại lý",
    currency: "VND",
    price: 280000,
    minQty: 200,
    vat: 8,
    discount: 8,
  },
];

const currencyFmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);

const FertilizerManagementOnePageModalEdit = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageItem[]>(defaultPackages);
  const [documents, setDocuments] = useState<DocItem[]>(defaultDocs);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>(defaultTiers);
  const [images, setImages] = useState<string[]>([
    "https://binhdien.com/images/npk-dau-trau/1161.jpg",
    "https://dpm.vn/public_folder/files_upload/202412/221-npk-16-16-813ste-mat-saupng-1735613860.webp",
  ]);

  const form = useForm({
    initialValues: {
      name: "Phân NPK Tổng Hợp 16-16-8",
      type: "npk",
      nutrientContent: "N:16% • P2O5:16% • K2O:8% • S:1% • Zn:0.02%",
      unit: "kg",
      manufacturer: "Công ty Phân bón Miền Nam",
      origin: "Việt Nam",
      registrationCode: "VT-23-4567",
      standard: "TCVN 1078:2021",
      description:
        "Dạng hạt tan chậm, bổ sung vi lượng cho giai đoạn phát triển tán lá và ra hoa.",
      hashtags: ["Sử dụng mùa mưa", "Hiệu quả cao", "Tan chậm"],
      certifications: ["ISO 9001", "VietGAP compatible"],
      sku: "NPK-16168-50KG",
      barcode: "8938501234567",
      hazardClass: "Không nguy hại (theo GHS)",
      shelfMonths: 24,
      warehouse: "Kho A - Bình Dương",
      location: "Kệ 3, Dãy B",
      minStock: 200,
      currentStock: 1260,
      lotTraceable: true,
      storage: ["khô ráo", "thoáng mát"],
      supplierId: companies?.[0]?.companyName ?? "",
      supplierTerms: "Thanh toán 30 ngày • Giao trong 72h • Đổi trả 7 ngày",
      packagingUnit: "kg",
      packagingSpec: ["Bao 25kg", "Bao 50kg"],
      crops: ["Cây ăn trái", "Rau màu", "Lúa"],
      stage: ["Phát triển thân lá", "Ra hoa – đậu trái"],
      dosagePerTree: 0.8,
      dosagePerHa: 350,
      frequencyDays: 30,
      usageNotes:
        "Tưới đủ ẩm sau khi bón. Tránh bón lúc nắng gắt. Không trộn chung với vôi sống.",
      safety: { gloves: true, mask: true, keepAwayChildren: true },
      visibility: "public",
      qaSpecs: [
        "Hàm ẩm ≤ 2%",
        "Kích cỡ hạt 2–4 mm ≥ 90%",
        "Hàm lượng tạp chất ≤ 0.5%",
        "pH 6.0–7.5",
      ],
      envNotes: "Bao bì có thể tái chế. Không xả thải ra nguồn nước.",
      related: ["URE-46-1KG", "DAP-18-46-50KG", "KALI-MOP-50KG"],
      batchHistory: [
        {
          batch: "BATCH-0825-NPK-001",
          mfg: "2025-08-01",
          exp: "2027-08-01",
          qty: 600,
        },
        {
          batch: "BATCH-0725-NPK-004",
          mfg: "2025-07-10",
          exp: "2027-07-10",
          qty: 660,
        },
      ],
    },
    validate: {
      name: (v) => (!v ? "Vui lòng nhập tên" : null),
      type: (v) => (!v ? "Vui lòng chọn loại" : null),
      nutrientContent: (v) => (!v ? "Vui lòng nhập hàm lượng" : null),
      registrationCode: (v) => (!v ? "Vui lòng nhập mã đăng ký" : null),
      shelfMonths: (v) => (v && v > 0 ? null : "Hạn dùng > 0"),
      minStock: (v) => (v >= 0 ? null : ">= 0"),
      currentStock: (v) => (v >= 0 ? null : ">= 0"),
    },
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [modalKey, setModalKey] = useState<
    | "basic"
    | "stock"
    | "packaging"
    | "supplier"
    | "usage"
    | "safety"
    | "documents"
    | "media"
    | "pricing"
    | "compliance"
    | null
  >(null);

  const openModal = (k: typeof modalKey) => {
    setModalKey(k);
    open();
  };

  const dosageSummary = useMemo(
    () =>
      `~${form.values.dosagePerTree} kg/cây • ${form.values.dosagePerHa} kg/ha • mỗi ${form.values.frequencyDays} ngày`,
    [
      form.values.dosagePerTree,
      form.values.dosagePerHa,
      form.values.frequencyDays,
    ]
  );

  const addPackage = () => {
    const n = packages.length + 1;
    setPackages((p) => [
      ...p,
      {
        id: `PKG-${n}`,
        unit: "Thùng",
        specification: `Thùng ${n * 5} gói x 1kg`,
        quantity: 20,
      },
    ]);
  };
  const removePackage = (id: string) =>
    setPackages((p) => p.filter((x) => x.id !== id));

  const onDropImages = (files: File[]) => {
    const readers = files.map(
      (f) =>
        new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result));
          r.readAsDataURL(f);
        })
    );
    Promise.all(readers).then((data) =>
      setImages((prev) => [...data, ...prev])
    );
  };

  const sectionTitle = (k: typeof modalKey) => {
    switch (k) {
      case "basic":
        return "Chỉnh sửa thông tin cơ bản";
      case "stock":
        return "Chỉnh sửa kho & lô";
      case "packaging":
        return "Chỉnh sửa đóng gói";
      case "supplier":
        return "Chỉnh sửa nhà cung cấp";
      case "usage":
        return "Chỉnh sửa hướng dẫn sử dụng";
      case "safety":
        return "Chỉnh sửa an toàn & bảo quản";
      case "documents":
        return "Quản lý tài liệu";
      case "media":
        return "Quản lý hình ảnh";
      case "pricing":
        return "Thiết lập giá & thuế";
      case "compliance":
        return "Tuân thủ & tiêu chuẩn";
      default:
        return "";
    }
  };

  const ModalBody = () => {
    if (!modalKey) return null;
    if (modalKey === "basic")
      return (
        <Stack gap="xs">
          <TextInput
            radius={4}
            label="Tên"
            withAsterisk
            {...form.getInputProps("name")}
          />
          <Group grow>
            <Select
              label="Loại"
              data={[
                { value: "npk", label: "Phân NPK" },
                { value: "ure", label: "Phân ure" },
                { value: "kali", label: "Phân kali" },
                { value: "dap", label: "Phân DAP" },
                { value: "lan", label: "Phân lân" },
                { value: "hữu cơ", label: "Phân hữu cơ" },
                { value: "vi sinh", label: "Phân vi sinh" },
              ]}
              {...form.getInputProps("type")}
            />
            <NumberInput
              radius={4}
              label="Hạn dùng (tháng)"
              {...form.getInputProps("shelfMonths")}
            />
          </Group>
          <TextInput
            radius={4}
            label="Hàm lượng dinh dưỡng"
            withAsterisk
            {...form.getInputProps("nutrientContent")}
          />
          <Group grow>
            <TextInput
              radius={4}
              label="Nhà sản xuất"
              {...form.getInputProps("manufacturer")}
            />
            <TextInput
              radius={4}
              label="Xuất xứ"
              {...form.getInputProps("origin")}
            />
          </Group>
          <Group grow>
            <TextInput
              radius={4}
              label="Mã đăng ký"
              {...form.getInputProps("registrationCode")}
            />
            <TextInput
              radius={4}
              label="Tiêu chuẩn"
              {...form.getInputProps("standard")}
            />
          </Group>
          <Group grow>
            <TextInput radius={4} label="SKU" {...form.getInputProps("sku")} />
            <TextInput
              radius={4}
              label="Barcode"
              {...form.getInputProps("barcode")}
            />
          </Group>
          <MultiSelect
            radius={4}
            label="Hashtag"
            data={form.values.hashtags}
            {...form.getInputProps("hashtags")}
          />
          <Textarea
            radius={4}
            label="Mô tả"
            minRows={2}
            autosize
            {...form.getInputProps("description")}
          />
        </Stack>
      );

    if (modalKey === "stock")
      return (
        <Stack gap="xs">
          <Group grow>
            <TextInput
              radius={4}
              label="Kho"
              {...form.getInputProps("warehouse")}
            />
            <TextInput
              radius={4}
              label="Vị trí"
              {...form.getInputProps("location")}
            />
          </Group>
          <Group grow>
            <NumberInput
              radius={4}
              label="Tồn tối thiểu"
              {...form.getInputProps("minStock")}
            />
            <NumberInput
              radius={4}
              label="Tồn hiện tại"
              {...form.getInputProps("currentStock")}
            />
          </Group>
          <Switch
            label="Theo dõi truy xuất lô"
            checked={form.values.lotTraceable}
            onChange={(e) =>
              form.setFieldValue("lotTraceable", e.currentTarget.checked)
            }
          />
          <Table withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Lô</Table.Th>
                <Table.Th>NSX</Table.Th>
                <Table.Th>HSD</Table.Th>
                <Table.Th>Số lượng</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {form.values.batchHistory.map((b, i) => (
                <Table.Tr key={i}>
                  <Table.Td>{b.batch}</Table.Td>
                  <Table.Td>{b.mfg}</Table.Td>
                  <Table.Td>{b.exp}</Table.Td>
                  <Table.Td>{b.qty}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      );

    if (modalKey === "packaging")
      return (
        <Stack gap="xs">
          <Group grow>
            <TextInput
              radius={4}
              label="Đơn vị"
              {...form.getInputProps("packagingUnit")}
            />
            <MultiSelect
              radius={4}
              label="Quy cách"
              data={["Bao 25kg", "Bao 50kg", "Bịch 1kg", "Thùng 10 gói x 1kg"]}
              {...form.getInputProps("packagingSpec")}
            />
          </Group>
          <Divider />
          <Stack gap="xs">
            {packages.map((pk) => (
              <Paper key={pk.id} withBorder radius={4} p="sm">
                <Group justify="space-between" align="center">
                  <Stack gap={2}>
                    <Text fw={600}>{pk.specification}</Text>
                    <Text size="sm" c="dimmed">
                      Đơn vị: {pk.unit} • SL: {pk.quantity}
                    </Text>
                  </Stack>
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => removePackage(pk.id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Paper>
            ))}
            <Button
              radius={4}
              variant="outline"
              leftSection={<IconPlus size={16} />}
              onClick={addPackage}
            >
              Thêm dòng đóng gói
            </Button>
          </Stack>
        </Stack>
      );

    if (modalKey === "supplier")
      return (
        <Stack gap="xs">
          <TextInput
            radius={4}
            label="Nhà cung cấp đã chọn"
            {...form.getInputProps("supplierId")}
          />
          <Textarea
            radius={4}
            label="Điều khoản NCC"
            minRows={2}
            autosize
            {...form.getInputProps("supplierTerms")}
          />
          <SelectableSupplierCards isCheckbox={false} isMultiple={false} />
        </Stack>
      );

    if (modalKey === "usage")
      return (
        <Stack gap="xs">
          <Group grow>
            <MultiSelect
              radius={4}
              label="Cây trồng"
              data={["Cây ăn trái", "Rau màu", "Lúa", "Cà phê", "Tiêu", "Điều"]}
              {...form.getInputProps("crops")}
            />
            <MultiSelect
              radius={4}
              label="Giai đoạn"
              data={[
                "Nảy mầm",
                "Phát triển thân lá",
                "Ra hoa – đậu trái",
                "Nuôi trái",
              ]}
              {...form.getInputProps("stage")}
            />
          </Group>
          <Group grow>
            <NumberInput
              radius={4}
              label="Liều (kg/cây)"
              {...form.getInputProps("dosagePerTree")}
            />
            <NumberInput
              radius={4}
              label="Liều (kg/ha)"
              {...form.getInputProps("dosagePerHa")}
            />
            <NumberInput
              radius={4}
              label="Chu kỳ (ngày)"
              {...form.getInputProps("frequencyDays")}
            />
          </Group>
          <Textarea
            radius={4}
            label="Ghi chú"
            minRows={2}
            autosize
            {...form.getInputProps("usageNotes")}
          />
        </Stack>
      );

    if (modalKey === "safety")
      return (
        <Stack gap="xs">
          <Group>
            <Switch
              label="Đeo găng"
              checked={form.values.safety.gloves}
              onChange={(e) =>
                form.setFieldValue("safety.gloves", e.currentTarget.checked)
              }
            />
            <Switch
              label="Đeo khẩu trang"
              checked={form.values.safety.mask}
              onChange={(e) =>
                form.setFieldValue("safety.mask", e.currentTarget.checked)
              }
            />
            <Switch
              label="Tránh xa trẻ em"
              checked={form.values.safety.keepAwayChildren}
              onChange={(e) =>
                form.setFieldValue(
                  "safety.keepAwayChildren",
                  e.currentTarget.checked
                )
              }
            />
          </Group>
          <MultiSelect
            radius={4}
            label="Bảo quản"
            data={["khô ráo", "thoáng mát", "tránh ánh nắng", "đậy kín"]}
            {...form.getInputProps("storage")}
          />
        </Stack>
      );

    if (modalKey === "documents")
      return (
        <Stack gap="xs">
          {documents.map((d, i) => (
            <Group key={i} justify="space-between">
              <Anchor href={d.url} target="_blank">
                {d.title}
              </Anchor>
              <ActionIcon
                color="red"
                variant="light"
                onClick={() =>
                  setDocuments((ds) => ds.filter((_, j) => j !== i))
                }
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ))}
          <Button
            radius={4}
            variant="outline"
            leftSection={<IconPlus size={16} />}
            onClick={() =>
              setDocuments((ds) => [
                ...ds,
                { title: "HDSD chi tiết", url: "#" },
              ])
            }
          >
            Thêm tài liệu
          </Button>
        </Stack>
      );

    if (modalKey === "media")
      return (
        <Stack gap="xs">
          <Input.Wrapper>
            <Dropzone
              onDrop={onDropImages}
              onReject={() => {}}
              maxSize={5 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
            >
              <Group
                justify="center"
                gap="xl"
                mih={140}
                style={{ pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <IconUpload size={40} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={40} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={40} />
                </Dropzone.Idle>
                <Text size="sm">Kéo & thả ảnh (tối đa 5MB)</Text>
              </Group>
            </Dropzone>
          </Input.Wrapper>
          <Scrollable h={120}>
            <Group wrap="nowrap" gap="sm">
              {images.map((src, i) => (
                <Paper key={i} withBorder radius={4} p={6}>
                  <Image src={src} h={120} w={160} fit="contain" radius="sm" />
                </Paper>
              ))}
            </Group>
          </Scrollable>
        </Stack>
      );

    if (modalKey === "pricing")
      return (
        <Stack gap="xs">
          {priceTiers.map((t, idx) => (
            <Card key={idx} withBorder radius={4} p="sm">
              <Group grow>
                <TextInput
                  radius={4}
                  label="Kênh"
                  value={t.channel}
                  onChange={(e) => {
                    const v = e.currentTarget.value;
                    setPriceTiers((arr) =>
                      arr.map((x, i) => (i === idx ? { ...x, channel: v } : x))
                    );
                  }}
                />
                <Select
                  radius={4}
                  label="Tiền tệ"
                  data={["VND"]}
                  value={t.currency}
                  onChange={(v) =>
                    setPriceTiers((arr) =>
                      arr.map((x, i) =>
                        i === idx ? { ...x, currency: String(v) } : x
                      )
                    )
                  }
                />
                <NumberInput
                  radius={4}
                  label="Giá cơ bản"
                  value={t.price}
                  onChange={(v) =>
                    setPriceTiers((arr) =>
                      arr.map((x, i) =>
                        i === idx ? { ...x, price: Number(v) } : x
                      )
                    )
                  }
                />
                <NumberInput
                  radius={4}
                  label="VAT (%)"
                  value={t.vat}
                  onChange={(v) =>
                    setPriceTiers((arr) =>
                      arr.map((x, i) =>
                        i === idx ? { ...x, vat: Number(v) } : x
                      )
                    )
                  }
                />
                <NumberInput
                  radius={4}
                  label="Giảm (%)"
                  value={t.discount ?? 0}
                  onChange={(v) =>
                    setPriceTiers((arr) =>
                      arr.map((x, i) =>
                        i === idx ? { ...x, discount: Number(v) } : x
                      )
                    )
                  }
                />
                <NumberInput
                  radius={4}
                  label="SL tối thiểu"
                  value={t.minQty}
                  onChange={(v) =>
                    setPriceTiers((arr) =>
                      arr.map((x, i) =>
                        i === idx ? { ...x, minQty: Number(v) } : x
                      )
                    )
                  }
                />
              </Group>
            </Card>
          ))}
          <Button
            radius={4}
            variant="outline"
            leftSection={<IconPlus size={16} />}
            onClick={() =>
              setPriceTiers((arr) => [
                ...arr,
                {
                  channel: "Mới",
                  currency: "VND",
                  price: 0,
                  minQty: 1,
                  vat: 8,
                },
              ])
            }
          >
            Thêm bậc giá
          </Button>
        </Stack>
      );

    if (modalKey === "compliance")
      return (
        <Stack gap="xs">
          <TextInput
            radius={4}
            label="Phân loại nguy hại (GHS)"
            {...form.getInputProps("hazardClass")}
          />
          <MultiSelect
            radius={4}
            label="Chứng nhận"
            data={["ISO 9001", "ISO 14001", "VietGAP compatible", "OCOP"]}
            value={form.values.certifications}
            onChange={(v) => form.setFieldValue("certifications", v)}
          />
          <MultiSelect
            radius={4}
            label="Thông số QA"
            data={form.values.qaSpecs}
            value={form.values.qaSpecs}
            onChange={(v) => form.setFieldValue("qaSpecs", v)}
          />
          <Textarea
            radius={4}
            label="Ghi chú môi trường"
            minRows={2}
            autosize
            {...form.getInputProps("envNotes")}
          />
        </Stack>
      );

    return null;
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius={4} withBorder>
        <Group mb="xs" justify="space-between">
          <Group>
            <Button
              radius={4}
              variant="subtle"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Title order={3}>🌿 Thêm phân bón</Title>
            <Badge color="green" variant="light">
              Đã điền sẵn
            </Badge>
          </Group>
          <Group gap="xs">
            <Badge
              color={
                form.values.currentStock > form.values.minStock ? "blue" : "red"
              }
            >
              Tồn kho: {form.values.currentStock} {form.values.unit}
            </Badge>
            <Badge variant="dot" color="gray">
              SKU: {form.values.sku}
            </Badge>
            <Badge variant="dot" color="gray">
              Barcode: {form.values.barcode}
            </Badge>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
          <Card withBorder radius={4} shadow="xs" p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Thông tin cơ bản</Title>
              <Button
                radius={4}
                size="xs"
                leftSection={<IconEdit size={16} />}
                onClick={() => openModal("basic")}
              >
                Sửa
              </Button>
            </Group>
            <Stack gap={6}>
              <Text>
                <b>Tên:</b> {form.values.name}
              </Text>
              <Text>
                <b>Loại:</b> {form.values.type}
              </Text>
              <Text>
                <b>Hàm lượng:</b> {form.values.nutrientContent}
              </Text>
              <Text>
                <b>Nhà SX:</b> {form.values.manufacturer} • <b>Xuất xứ:</b>{" "}
                {form.values.origin}
              </Text>
              <Text>
                <b>ĐK:</b> {form.values.registrationCode} • <b>TC:</b>{" "}
                {form.values.standard}
              </Text>
              <Text>
                <b>Hạn dùng:</b> {form.values.shelfMonths} tháng
              </Text>
              <Text size="sm" c="dimmed">
                {form.values.description}
              </Text>
              <Group gap="xs">
                {form.values.hashtags.map((h) => (
                  <Badge key={h} variant="light">
                    {h}
                  </Badge>
                ))}
              </Group>
              <Group gap="xs">
                {form.values.certifications.map((c) => (
                  <Badge key={c} leftSection={<IconCheck size={12} />}>
                    {c}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Card>

          <Card withBorder radius={4} shadow="xs" p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Nhà cung cấp</Title>
              <Button
                radius={4}
                size="xs"
                leftSection={<IconEdit size={16} />}
                onClick={() => openModal("supplier")}
              >
                Sửa
              </Button>
            </Group>
            <Stack gap={6}>
              <Text>
                <b>Đã chọn:</b> {form.values.supplierId}
              </Text>
              <Text size="sm" c="dimmed">
                {form.values.supplierTerms}
              </Text>
              <Divider my="xs" />
              <Scrollable h={180}>
                <Group align="flex-start" gap="md" wrap="nowrap">
                  {companies.map((item, idx) => (
                    <Card
                      key={idx}
                      withBorder
                      shadow="sm"
                      radius={4}
                      miw={320}
                      p="sm"
                    >
                      <Stack gap={2}>
                        <Text fw={600}>{item.companyName}</Text>
                        <Text size="sm">
                          <b>Loại DN:</b> {item.businessType}
                        </Text>
                        <Text size="sm">
                          <b>Đại diện:</b> {item.representative}
                        </Text>
                        <Text size="sm">
                          <b>SĐT:</b> {item.phoneNumber}
                        </Text>
                        <Group gap="xs" mt={4}>
                          <Anchor size="sm" href="#" c="blue.6">
                            Xem hồ sơ
                          </Anchor>
                          <IconExternalLink size={14} />
                        </Group>
                      </Stack>
                    </Card>
                  ))}
                </Group>
              </Scrollable>
            </Stack>
          </Card>

          <Card withBorder radius={4} shadow="xs" p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Hướng dẫn sử dụng</Title>
              <Button
                radius={4}
                size="xs"
                leftSection={<IconEdit size={16} />}
                onClick={() => openModal("usage")}
              >
                Sửa
              </Button>
            </Group>
            <Stack gap={6}>
              <Text>
                <b>Cây trồng:</b> {form.values.crops.join(", ")}
              </Text>
              <Text>
                <b>Giai đoạn:</b> {form.values.stage.join(", ")}
              </Text>
              <Badge variant="light">{dosageSummary}</Badge>
              <Text size="sm" c="dimmed">
                {form.values.usageNotes}
              </Text>
            </Stack>
          </Card>

          <Card withBorder radius={4} shadow="xs" p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>An toàn & bảo quản</Title>
              <Button
                radius={4}
                size="xs"
                leftSection={<IconEdit size={16} />}
                onClick={() => openModal("safety")}
              >
                Sửa
              </Button>
            </Group>
            <Stack gap={6}>
              <Text>
                <b>Bảo hộ:</b>{" "}
                {[
                  form.values.safety.gloves ? "Găng" : null,
                  form.values.safety.mask ? "Khẩu trang" : null,
                  form.values.safety.keepAwayChildren
                    ? "Tránh xa trẻ em"
                    : null,
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </Text>
              <Text>
                <b>Bảo quản:</b> {form.values.storage.join(", ")}
              </Text>
            </Stack>
          </Card>

          <Card withBorder radius={4} shadow="xs" p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Giá & thuế</Title>
              <Button
                radius={4}
                size="xs"
                leftSection={<IconEdit size={16} />}
                onClick={() => openModal("pricing")}
              >
                Sửa
              </Button>
            </Group>
            <Stack gap={6}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Kênh</Table.Th>
                    <Table.Th>Giá</Table.Th>
                    <Table.Th>VAT</Table.Th>
                    <Table.Th>Giảm</Table.Th>
                    <Table.Th>SL tối thiểu</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {priceTiers.map((t, i) => (
                    <Table.Tr key={i}>
                      <Table.Td>{t.channel}</Table.Td>
                      <Table.Td>{currencyFmt(t.price)}</Table.Td>
                      <Table.Td>{t.vat}%</Table.Td>
                      <Table.Td>{t.discount ?? 0}%</Table.Td>
                      <Table.Td>{t.minQty}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Card>

          <Card withBorder radius={4} shadow="xs" p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Tuân thủ & tiêu chuẩn</Title>
              <Button
                radius={4}
                size="xs"
                leftSection={<IconEdit size={16} />}
                onClick={() => openModal("compliance")}
              >
                Sửa
              </Button>
            </Group>
            <Stack gap={6}>
              <Text>
                <b>GHS:</b> {form.values.hazardClass}
              </Text>
              <Group gap="xs">
                {form.values.certifications.map((c) => (
                  <Badge key={c} leftSection={<IconCheck size={12} />}>
                    {c}
                  </Badge>
                ))}
              </Group>
              <Text>
                <b>QA:</b> {form.values.qaSpecs.join(" • ")}
              </Text>
              <Text size="sm" c="dimmed">
                {form.values.envNotes}
              </Text>
            </Stack>
          </Card>

          <Card withBorder radius={4} shadow="xs" p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Tài liệu</Title>
              <Button
                radius={4}
                size="xs"
                leftSection={<IconEdit size={16} />}
                onClick={() => openModal("documents")}
              >
                Sửa
              </Button>
            </Group>
            <Stack gap="xs">
              {documents.map((d, i) => (
                <Group key={i} gap="xs">
                  <Anchor href={d.url}>{d.title}</Anchor>
                </Group>
              ))}
            </Stack>
          </Card>

          <Card withBorder radius={4} shadow="xs" p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Hình ảnh</Title>
              <Button
                radius={4}
                size="xs"
                leftSection={<IconEdit size={16} />}
                onClick={() => openModal("media")}
              >
                Sửa
              </Button>
            </Group>
            <Scrollable h={100}>
              <Group wrap="nowrap" gap="sm">
                {images.map((src, i) => (
                  <Paper key={i} withBorder radius={4} p={6}>
                    <Image
                      src={src}
                      h={100}
                      w={140}
                      fit="contain"
                      radius="sm"
                    />
                  </Paper>
                ))}
              </Group>
            </Scrollable>
          </Card>
        </SimpleGrid>
      </Card>

      <Modal
        opened={opened}
        onClose={close}
        title={sectionTitle(modalKey)}
        centered
        size="lg"
        radius={4}
      >
        <Stack gap="md">
          <ModalBody />
          <Group justify="flex-end" mt="xs">
            <Button radius={4} variant="default" onClick={close}>
              Hủy
            </Button>
            <Button
              radius={4}
              color="green"
              onClick={() => {
                close();
              }}
            >
              Lưu
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default FertilizerManagementOnePageModalEdit;
