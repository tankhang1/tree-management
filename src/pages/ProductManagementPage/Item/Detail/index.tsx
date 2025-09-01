import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Image,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  IconArrowLeft,
  IconEdit,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
  IconPhoto,
  IconSearch,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Scrollable from "../../../../components/Scrollable";
import { types } from "../../Type";
import { materialList } from "../Add";

type BOMItem = {
  id: string;
  kind: "product" | "material";
  code: string;
  name: string;
  img?: string;
  quantity: number;
  unit: string;
  specification?: string;
  note?: string;
};

type Product = {
  productCode: string;
  productName: string;
  tree: string;
  category: string;
  public: boolean;
  description: string;
  hashtags: string[];
  images: string[];
  unit: string;
  weight: number;
  packaging: string;
  importPrice: number;
  salePrice: number;
  discount: number;
  sku: string;
  barcode: string;
  stock: number;
  minStock: number;
  warehouse: string;
  origin: string;
  expiryDate?: Date | null;
  certifications: string[];
  bomItems: BOMItem[];
};

const money = (n: number) => (n ?? 0).toLocaleString("vi-VN") + " ₫";

const Section = ({
  title,
  right,
  color = "blue",
  children,
}: {
  title: React.ReactNode;
  right?: React.ReactNode;
  color?: string;
  children: React.ReactNode;
}) => (
  <Card withBorder radius={4} p="lg">
    <Group justify="space-between" mb="xs">
      <Group gap={8}>
        <Badge color={color} variant="filled">
          {typeof title === "string" ? title : null}
        </Badge>
        {typeof title !== "string" ? title : null}
      </Group>
      {right}
    </Group>
    {children}
  </Card>
);

const ProductManagementItemDetailPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<Product>({
    productCode: "SP001",
    productName: "Sầu riêng Ri6",
    tree: "Sầu riêng",
    category: "Trái cây",
    public: true,
    description:
      "Sầu riêng Ri6 đặc sản miền Tây, cơm vàng, hạt lép, thơm đậm. Thu hoạch từ vườn VietGAP.",
    hashtags: ["Đặc sản", "Xuất khẩu", "VietGAP"],
    images: [
      "https://images.baodantoc.vn/uploads/2021/Tháng_10/Ngafy%202/Anh/untitled%20folder/giai-phap-cho-nong-nghiep-ben-vung.jpg",
      "https://placehold.co/600x400?text=Hinh+2",
      "https://placehold.co/600x400?text=Hinh+3",
    ],
    unit: "Kg",
    weight: 30,
    packaging: "Bịch 30 kg",
    importPrice: 50000,
    salePrice: 80000,
    discount: 10,
    sku: "SR-RI6-30KG",
    barcode: "8938501234567",
    stock: 120,
    minStock: 20,
    warehouse: "Kho A",
    origin: "Việt Nam",
    expiryDate: dayjs().add(7, "day").toDate(),
    certifications: ["VietGAP"],
    bomItems: [
      {
        id: "mat-PHAN-1",
        kind: "material",
        code: "MAT001",
        name: "Phân hữu cơ",
        img: "https://glawvn.com/wp-content/uploads/2023/04/phan-huu-co-la-gi-cac-loai-phan-huu-co-hien-hanh.jpeg",
        quantity: 5,
        unit: "Kg",
        note: "Dùng cải tạo đất",
      },
      {
        id: "prd-DONGGOI-1",
        kind: "product",
        code: "PKG250",
        name: "Bao bì 250g",
        img: "https://baobionline.com/wp-content/uploads/2018/11/IMG20180820175120-van.jpg",
        quantity: 1,
        unit: "Cái",
        specification: "Túi zipper",
      },
    ],
  });

  const [modalOpen, { open, close }] = useDisclosure(false);
  const [modalType, setModalType] = useState<
    "basic" | "media" | "pricing" | "inventory" | "compliance" | "bomAdd" | null
  >(null);
  const [draft, setDraft] = useState<any>({});
  const [bomDraft, setBomDraft] = useState<BOMItem>({
    id: "",
    kind: "material",
    code: "",
    name: "",
    img: "",
    quantity: 1,
    unit: "Kg",
    specification: "",
    note: "",
  });

  const afterDiscount = useMemo(
    () =>
      Math.max(
        0,
        Math.round(data.salePrice * (1 - (data.discount || 0) / 100))
      ),
    [data.salePrice, data.discount]
  );
  const profit = useMemo(
    () => Math.round(afterDiscount - data.importPrice),
    [afterDiscount, data.importPrice]
  );
  const margin = useMemo(
    () => (afterDiscount ? (profit / afterDiscount) * 100 : 0),
    [profit, afterDiscount]
  );

  const openModal = (type: NonNullable<typeof modalType>) => {
    if (type === "basic")
      setDraft({
        productCode: data.productCode,
        productName: data.productName,
        tree: data.tree,
        category: data.category,
        description: data.description,
        public: data.public,
      });
    if (type === "media")
      setDraft({ images: [...data.images], hashtags: [...data.hashtags] });
    if (type === "pricing")
      setDraft({
        unit: data.unit,
        weight: data.weight,
        packaging: data.packaging,
        importPrice: data.importPrice,
        salePrice: data.salePrice,
        discount: data.discount,
      });
    if (type === "inventory")
      setDraft({
        sku: data.sku,
        barcode: data.barcode,
        stock: data.stock,
        minStock: data.minStock,
        warehouse: data.warehouse,
      });
    if (type === "compliance")
      setDraft({
        origin: data.origin,
        expiryDate: data.expiryDate,
        certifications: [...data.certifications],
        public: data.public,
      });
    if (type === "bomAdd")
      setBomDraft({
        id: "",
        kind: "material",
        code: "",
        name: "",
        img: "",
        quantity: 1,
        unit: "Kg",
        specification: "",
        note: "",
      });
    setModalType(type);
    open();
  };

  const applyModal = () => {
    if (modalType === "basic") setData((s) => ({ ...s, ...draft }));
    if (modalType === "media")
      setData((s) => ({
        ...s,
        images: draft.images ?? [],
        hashtags: draft.hashtags ?? [],
      }));
    if (modalType === "pricing")
      setData((s) => ({
        ...s,
        unit: draft.unit,
        weight: Number(draft.weight) || 0,
        packaging: draft.packaging,
        importPrice: Number(draft.importPrice) || 0,
        salePrice: Number(draft.salePrice) || 0,
        discount: Number(draft.discount) || 0,
      }));
    if (modalType === "inventory")
      setData((s) => ({
        ...s,
        sku: draft.sku,
        barcode: draft.barcode,
        stock: Number(draft.stock) || 0,
        minStock: Number(draft.minStock) || 0,
        warehouse: draft.warehouse,
      }));
    if (modalType === "compliance")
      setData((s) => ({
        ...s,
        origin: draft.origin,
        expiryDate: draft.expiryDate,
        certifications: draft.certifications ?? [],
        public: !!draft.public,
      }));
    if (modalType === "bomAdd" && bomDraft.name && bomDraft.code) {
      setData((s) => ({
        ...s,
        bomItems: [
          ...s.bomItems,
          {
            ...bomDraft,
            id: `${bomDraft.kind}-${bomDraft.code}-${Date.now()}`,
          },
        ],
      }));
    }
    close();
  };

  const removeBOM = (id: string) =>
    setData((s) => ({ ...s, bomItems: s.bomItems.filter((x) => x.id !== id) }));

  return (
    <>
      <Card withBorder shadow="sm" radius={4} p="xl">
        <Stack>
          <Group justify="space-between" mb="md" align="flex-start">
            <Group>
              <Button
                radius={4}
                variant="subtle"
                leftSection={<IconArrowLeft size={18} />}
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
              <Stack gap={2}>
                <Title order={3}>Chi tiết sản phẩm</Title>
                <Group gap={8} wrap="wrap">
                  <Badge variant="dot" color={data.public ? "teal" : "gray"}>
                    {data.public ? "Công khai" : "Nháp"}
                  </Badge>
                  <Badge>{data.category}</Badge>
                  <Badge>{data.tree}</Badge>
                  <Badge>{data.unit}</Badge>
                </Group>
              </Stack>
            </Group>
          </Group>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack>
                <Section
                  color="blue"
                  title="Thông tin cơ bản"
                  right={
                    <ActionIcon
                      variant="light"
                      onClick={() => openModal("basic")}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  }
                >
                  <Grid gutter="md">
                    <Grid.Col span={{ base: 12, sm: 7 }}>
                      <Stack gap={6}>
                        <Text>
                          <b>Mã:</b> {data.productCode}
                        </Text>
                        <Text>
                          <b>Tên:</b> {data.productName}
                        </Text>
                        <Text>
                          <b>Loại:</b> {data.category}
                        </Text>
                        <Text>
                          <b>Giống/Cây:</b> {data.tree}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {data.description}
                        </Text>
                        <Group gap={6} mt="xs" wrap="wrap">
                          {data.hashtags.map((h) => (
                            <Badge key={h} variant="light">
                              {h}
                            </Badge>
                          ))}
                        </Group>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 5 }}>
                      <Card withBorder radius={10} p="xs">
                        <Image
                          src={data.images[0]}
                          h={180}
                          radius={4}
                          fit="cover"
                        />
                        <Group gap={6} mt="xs" wrap="wrap">
                          {data.images.slice(1).map((src, i) => (
                            <Image
                              key={i}
                              src={src}
                              w={60}
                              h={48}
                              radius={6}
                              fit="cover"
                            />
                          ))}
                        </Group>
                        <Button
                          radius={4}
                          mt="sm"
                          variant="light"
                          onClick={() => openModal("media")}
                        >
                          Ảnh & Hashtag
                        </Button>
                      </Card>
                    </Grid.Col>
                  </Grid>
                </Section>

                <Section
                  color="grape"
                  title="Cấu phần (BOM)"
                  right={
                    <Button
                      radius={4}
                      leftSection={<IconPlus size={16} />}
                      onClick={() => openModal("bomAdd")}
                    >
                      Thêm
                    </Button>
                  }
                >
                  <Stack gap="sm">
                    {data.bomItems.length === 0 && (
                      <Text c="dimmed">Chưa có cấu phần.</Text>
                    )}
                    {data.bomItems.map((it) => (
                      <Card key={it.id} withBorder radius={10} p="md">
                        <Group justify="space-between" align="flex-start">
                          <Group align="flex-start">
                            <Image
                              src={it.img}
                              w={84}
                              h={84}
                              radius={4}
                              fit="cover"
                              fallbackSrc="https://placehold.co/120x120?text=IMG"
                            />
                            <Stack gap={2}>
                              <Group gap={6}>
                                <Badge
                                  variant="dot"
                                  color={
                                    it.kind === "product" ? "indigo" : "teal"
                                  }
                                >
                                  {it.kind === "product"
                                    ? "Sản phẩm"
                                    : "Nguyên liệu"}
                                </Badge>
                                <Badge variant="light">{it.code}</Badge>
                              </Group>
                              <Text fw={600}>{it.name}</Text>
                              <Text size="sm">
                                Số lượng: {it.quantity} {it.unit}
                              </Text>
                              {it.specification && (
                                <Text size="sm">
                                  Quy cách: {it.specification}
                                </Text>
                              )}
                              {it.note && (
                                <Text size="sm" c="dimmed">
                                  Ghi chú: {it.note}
                                </Text>
                              )}
                            </Stack>
                          </Group>
                          <ActionIcon
                            color="red"
                            variant="light"
                            onClick={() => removeBOM(it.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </Section>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack>
                <Section
                  color="teal"
                  title="Giá & Quy cách"
                  right={
                    <ActionIcon
                      variant="light"
                      onClick={() => openModal("pricing")}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  }
                >
                  <SimpleGrid cols={2} spacing="sm">
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Đơn vị
                      </Text>
                      <Text fw={600}>{data.unit}</Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Trọng lượng
                      </Text>
                      <Text fw={600}>
                        {data.weight} {data.unit}
                      </Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Quy cách
                      </Text>
                      <Text fw={600}>{data.packaging}</Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Chiết khấu
                      </Text>
                      <Text fw={600}>{data.discount}%</Text>
                    </Stack>
                  </SimpleGrid>
                  <Divider my="sm" />
                  <SimpleGrid cols={2} spacing="sm">
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Giá nhập
                      </Text>
                      <Text fw={700}>{money(data.importPrice)}</Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Giá bán
                      </Text>
                      <Text fw={700}>{money(data.salePrice)}</Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Giá sau CK
                      </Text>
                      <Text fw={700} c="teal">
                        {money(afterDiscount)}
                      </Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Lợi nhuận ước tính
                      </Text>
                      <Text fw={700} c={profit >= 0 ? "blue" : "red"}>
                        {money(profit)} ({margin.toFixed(1)}%)
                      </Text>
                    </Stack>
                  </SimpleGrid>
                </Section>

                <Section
                  color="indigo"
                  title="Kho & Mã hóa"
                  right={
                    <ActionIcon
                      variant="light"
                      onClick={() => openModal("inventory")}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  }
                >
                  <SimpleGrid cols={2} spacing="sm">
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        SKU
                      </Text>
                      <Text fw={600}>{data.sku}</Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Barcode
                      </Text>
                      <Text fw={600}>{data.barcode}</Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Tồn kho
                      </Text>
                      <Text fw={700}>{data.stock}</Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Tồn tối thiểu
                      </Text>
                      <Text fw={700}>{data.minStock}</Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Kho
                      </Text>
                      <Text fw={600}>{data.warehouse}</Text>
                    </Stack>
                  </SimpleGrid>
                </Section>

                <Section
                  color="orange"
                  title="Nguồn gốc & Tuân thủ"
                  right={
                    <ActionIcon
                      variant="light"
                      onClick={() => openModal("compliance")}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  }
                >
                  <SimpleGrid cols={2} spacing="sm">
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Xuất xứ
                      </Text>
                      <Text fw={600}>{data.origin}</Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        Hạn dùng
                      </Text>
                      <Text fw={600}>
                        {data.expiryDate
                          ? dayjs(data.expiryDate).format("DD/MM/YYYY")
                          : "—"}
                      </Text>
                    </Stack>
                  </SimpleGrid>
                  <Group gap={6} mt="xs" wrap="wrap">
                    {data.certifications.map((c) => (
                      <Badge key={c} variant="light" color="orange">
                        {c}
                      </Badge>
                    ))}
                    {data.public ? (
                      <Badge color="teal">Công khai</Badge>
                    ) : (
                      <Badge color="gray">Nháp</Badge>
                    )}
                  </Group>
                </Section>
              </Stack>
            </Grid.Col>
          </Grid>

          <Section color="green" title="Tổng quan nhanh">
            <SimpleGrid cols={{ base: 1, md: 4 }}>
              <Stack gap={2}>
                <Text size="xs" c="dimmed">
                  Mã sản phẩm
                </Text>
                <Text fw={700}>{data.productCode}</Text>
              </Stack>
              <Stack gap={2}>
                <Text size="xs" c="dimmed">
                  Tên sản phẩm
                </Text>
                <Text fw={700}>{data.productName}</Text>
              </Stack>
              <Stack gap={2}>
                <Text size="xs" c="dimmed">
                  Giá bán
                </Text>
                <Text fw={700}>{money(data.salePrice)}</Text>
              </Stack>
              <Stack gap={2}>
                <Text size="xs" c="dimmed">
                  Tồn kho
                </Text>
                <Text fw={700}>{data.stock}</Text>
              </Stack>
            </SimpleGrid>
          </Section>
        </Stack>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={close}
        centered
        radius={4}
        size="lg"
        title={<Title order={5}>Chỉnh sửa</Title>}
      >
        {modalType === "basic" && (
          <Stack>
            <SimpleGrid cols={2}>
              <TextInput
                radius={4}
                label="Mã sản phẩm"
                value={draft.productCode}
                onChange={(e) =>
                  setDraft({ ...draft, productCode: e.currentTarget.value })
                }
              />
              <TextInput
                radius={4}
                label="Tên sản phẩm"
                value={draft.productName}
                onChange={(e) =>
                  setDraft({ ...draft, productName: e.currentTarget.value })
                }
              />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <TextInput
                radius={4}
                label="Giống/Cây"
                value={draft.tree}
                onChange={(e) =>
                  setDraft({ ...draft, tree: e.currentTarget.value })
                }
              />
              <Select
                radius={4}
                label="Loại"
                value={draft.category}
                onChange={(v) => setDraft({ ...draft, category: v })}
                data={["Trái cây", "Đồ uống", "Thực phẩm chế biến"]}
                searchable
                clearable
              />
            </SimpleGrid>
            <Textarea
              radius={4}
              label="Mô tả"
              minRows={3}
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.currentTarget.value })
              }
            />
            <Switch
              label="Công khai"
              checked={draft.public}
              onChange={(e) =>
                setDraft({ ...draft, public: e.currentTarget.checked })
              }
            />
            <Group justify="flex-end" mt="sm">
              <Button radius={4} variant="default" onClick={close}>
                Hủy
              </Button>
              <Button radius={4} onClick={applyModal}>
                Lưu
              </Button>
            </Group>
          </Stack>
        )}

        {modalType === "media" && (
          <Stack>
            <MultiSelect
              label="Hashtag"
              value={draft.hashtags}
              onChange={(v) => setDraft({ ...draft, hashtags: v })}
              data={[
                "Hữu cơ",
                "Vô cơ",
                "Năng suất cao",
                "Chất lượng cao",
                "Thân thiện môi trường",
                "Phổ biến",
                "Xuất khẩu",
                "Đặc sản",
                "Giống mới",
              ]}
              searchable
              clearable
            />
            <Dropzone
              accept={IMAGE_MIME_TYPE}
              maxSize={5 * 1024 ** 2}
              onDrop={(files) => {
                const urls = files.map((f) => URL.createObjectURL(f));
                setDraft((d: any) => ({
                  ...d,
                  images: [...(d.images ?? []), ...urls],
                }));
              }}
            >
              <Group
                justify="center"
                gap="xl"
                mih={140}
                style={{ pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <IconUpload size={48} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={48} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={48} />
                </Dropzone.Idle>
                <div>
                  <Text size="lg">Kéo thả hoặc bấm để tải ảnh</Text>
                  <Text size="sm" c="dimmed">
                    Tối đa 5MB/ảnh
                  </Text>
                </div>
              </Group>
            </Dropzone>
            <Group gap="xs" mt="sm" wrap="wrap">
              {(draft.images ?? []).map((src: string, i: number) => (
                <Card key={i} p={4} withBorder radius={4}>
                  <Group gap={6}>
                    <Image src={src} w={100} h={70} radius={6} />
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() =>
                        setDraft((d: any) => ({
                          ...d,
                          images: d.images.filter(
                            (_: any, idx: number) => idx !== i
                          ),
                        }))
                      }
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
            </Group>
            <Group justify="flex-end" mt="sm">
              <Button radius={4} variant="default" onClick={close}>
                Hủy
              </Button>
              <Button radius={4} onClick={applyModal}>
                Lưu
              </Button>
            </Group>
          </Stack>
        )}

        {modalType === "pricing" && (
          <Stack>
            <SimpleGrid cols={2}>
              <Select
                radius={4}
                label="Đơn vị"
                value={draft.unit}
                onChange={(v) => setDraft({ ...draft, unit: v })}
                data={["Kg", "Thùng", "Hộp"]}
              />
              <NumberInput
                radius={4}
                label="Trọng lượng"
                min={0}
                value={draft.weight}
                onChange={(v) => setDraft({ ...draft, weight: Number(v) })}
              />
            </SimpleGrid>
            <Select
              radius={4}
              label="Quy cách"
              data={["Bịch 30 kg", "Thùng 12 hộp", "Hộp 250 g"]}
            />
            <SimpleGrid cols={3}>
              <NumberInput
                radius={4}
                label="Giá nhập"
                min={0}
                thousandSeparator=","
                value={draft.importPrice}
                onChange={(v) => setDraft({ ...draft, importPrice: Number(v) })}
              />
              <NumberInput
                radius={4}
                label="Giá bán"
                min={0}
                thousandSeparator=","
                value={draft.salePrice}
                onChange={(v) => setDraft({ ...draft, salePrice: Number(v) })}
              />
              <NumberInput
                radius={4}
                label="Chiết khấu (%)"
                min={0}
                max={100}
                value={draft.discount}
                onChange={(v) => setDraft({ ...draft, discount: Number(v) })}
              />
            </SimpleGrid>
            <Group justify="flex-end" mt="sm">
              <Button radius={4} variant="default" onClick={close}>
                Hủy
              </Button>
              <Button radius={4} onClick={applyModal}>
                Lưu
              </Button>
            </Group>
          </Stack>
        )}

        {modalType === "inventory" && (
          <Stack>
            <SimpleGrid cols={2}>
              <TextInput
                radius={4}
                label="SKU"
                value={draft.sku}
                onChange={(e) =>
                  setDraft({ ...draft, sku: e.currentTarget.value })
                }
              />
              <TextInput
                radius={4}
                label="Barcode"
                value={draft.barcode}
                onChange={(e) =>
                  setDraft({ ...draft, barcode: e.currentTarget.value })
                }
              />
            </SimpleGrid>
            <SimpleGrid cols={3}>
              <NumberInput
                radius={4}
                label="Tồn kho"
                min={0}
                value={draft.stock}
                onChange={(v) => setDraft({ ...draft, stock: Number(v) })}
              />
              <NumberInput
                radius={4}
                label="Tồn tối thiểu"
                min={0}
                value={draft.minStock}
                onChange={(v) => setDraft({ ...draft, minStock: Number(v) })}
              />
              <Select
                radius={4}
                label="Kho"
                value={draft.warehouse}
                onChange={(v) => setDraft({ ...draft, warehouse: v })}
                data={["Kho A", "Kho B", "Kho C"]}
              />
            </SimpleGrid>
            <Group justify="flex-end" mt="sm">
              <Button radius={4} variant="default" onClick={close}>
                Hủy
              </Button>
              <Button radius={4} onClick={applyModal}>
                Lưu
              </Button>
            </Group>
          </Stack>
        )}

        {modalType === "compliance" && (
          <Stack>
            <SimpleGrid cols={2}>
              <TextInput
                radius={4}
                label="Xuất xứ"
                value={draft.origin}
                onChange={(e) =>
                  setDraft({ ...draft, origin: e.currentTarget.value })
                }
              />
              <DatePickerInput
                label="Hạn dùng"
                value={draft.expiryDate}
                onChange={(v) => setDraft({ ...draft, expiryDate: v })}
              />
            </SimpleGrid>
            <MultiSelect
              label="Chứng nhận"
              value={draft.certifications}
              onChange={(v) => setDraft({ ...draft, certifications: v })}
              data={["VietGAP", "GlobalGAP", "HACCP", "ISO 22000"]}
              searchable
              clearable
            />
            <Switch
              label="Công khai"
              checked={draft.public}
              onChange={(e) =>
                setDraft({ ...draft, public: e.currentTarget.checked })
              }
            />
            <Group justify="flex-end" mt="sm">
              <Button radius={4} variant="default" onClick={close}>
                Hủy
              </Button>
              <Button radius={4} onClick={applyModal}>
                Lưu
              </Button>
            </Group>
          </Stack>
        )}

        {modalType === "bomAdd" && (
          <Stack>
            <Select
              radius={4}
              label="Loại cấu phần"
              value={bomDraft.kind}
              onChange={(v) =>
                setBomDraft((s) => ({ ...s, kind: (v as any) ?? "material" }))
              }
              data={[
                { value: "product", label: "Sản phẩm" },
                { value: "material", label: "Nguyên vật liệu" },
              ]}
            />
            {bomDraft.kind === "product" ? (
              <Stack gap={"xs"}>
                <TextInput
                  radius={4}
                  placeholder="Loại sản phẩm"
                  label="Loại sản phẩm"
                  leftSection={<IconSearch size={18} />}
                />
                <Scrollable h={200}>
                  <Group gap="md" wrap="nowrap" p={"xs"}>
                    {types.map((category, index) => (
                      <Card
                        h={200}
                        key={index}
                        withBorder
                        shadow="sm"
                        radius="md"
                        style={{
                          width: "150px",
                          cursor: "pointer",
                        }}
                      >
                        <Stack align="center" justify="center" gap="xs">
                          <Image src={category.img} h={100} />
                          <Text ta="center" fw={500}>
                            {category.name}
                          </Text>
                        </Stack>
                      </Card>
                    ))}
                  </Group>
                </Scrollable>
              </Stack>
            ) : (
              <Stack gap={"xs"}>
                <TextInput
                  placeholder="Nguyên vật liệu"
                  label="Nguyên vật liệu"
                  leftSection={<IconSearch size={18} />}
                  radius={4}
                />
                <Scrollable>
                  <Group p={"xs"} gap="md" wrap="nowrap">
                    {materialList.map((material, index) => (
                      <Card
                        w={300}
                        h={350}
                        key={index}
                        withBorder
                        shadow="sm"
                        radius="md"
                        p="md"
                        style={{
                          position: "relative",
                          transition: "transform 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.02)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        <Stack>
                          <Image
                            src={material.img}
                            alt={material.materialName}
                            h={150}
                            radius="md"
                          />
                          <Text>
                            <b>Mã nguyên vật liệu:</b> {material.materialCode}
                          </Text>
                          <Text>
                            <b>Tên nguyên vật liệu:</b> {material.materialName}
                          </Text>

                          <Text>
                            <b>Mô tả:</b> {material.description}
                          </Text>
                        </Stack>
                      </Card>
                    ))}
                  </Group>
                </Scrollable>
              </Stack>
            )}

            <SimpleGrid cols={3}>
              <NumberInput
                radius={4}
                label="Số lượng"
                min={0.1}
                step={0.1}
                value={bomDraft.quantity}
                onChange={(v) =>
                  setBomDraft({ ...bomDraft, quantity: Number(v) })
                }
              />
              <Select
                radius={4}
                label="Đơn vị"
                value={bomDraft.unit}
                onChange={(v) =>
                  setBomDraft({ ...bomDraft, unit: (v as string) ?? "Kg" })
                }
                data={["Kg", "Cái", "Gói", "Thùng", "Hộp"]}
              />
              <Select
                radius={4}
                label="Quy cách"
                data={["Túi zipper", "Thùng carton", "Hộp nhựa"]}
              />
            </SimpleGrid>
            <Textarea
              radius={4}
              label="Ghi chú"
              minRows={2}
              value={bomDraft.note}
              onChange={(e) =>
                setBomDraft({ ...bomDraft, note: e.currentTarget.value })
              }
            />
            <Group justify="flex-end" mt="sm">
              <Button radius={4} variant="default" onClick={close}>
                Hủy
              </Button>
              <Button
                radius={4}
                onClick={applyModal}
                disabled={!bomDraft.code || !bomDraft.name}
              >
                Thêm
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
};

export default ProductManagementItemDetailPage;
