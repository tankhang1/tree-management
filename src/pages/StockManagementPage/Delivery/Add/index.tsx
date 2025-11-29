import {
  Stepper,
  TextInput,
  Button,
  Group,
  Stack,
  Card,
  FileButton,
  Text,
  Title,
  Badge,
  Divider,
  Grid,
  SegmentedControl,
  Select,
  SimpleGrid,
  ScrollArea,
  Flex,
  Input,
  Center,
  LoadingOverlay,
  ActionIcon,
  Avatar,
  NumberInput, // Thêm Avatar để hiển thị ảnh nhỏ
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect, useMemo } from "react";
import {
  IconArrowLeft,
  IconBuildingFactory,
  IconCheck,
  IconDownload,
  IconMapPin,
  IconPlant2,
  IconPlus,
  IconSearch,
  IconSpray,
  IconTools,
  IconTractor,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import type { MRT_ColumnDef } from "mantine-react-table";

// Components
import AreaCard from "./components/AreaCard";
import { SelectableEnterpriseCards } from "./components/SelectableEnterpriseCards";
import Table from "../../../../components/Table";

// Stores
import { useCompanyStore } from "../../../zustand/companyStore";
import { useStockAreaStore } from "../../../zustand/stockAreaStore";
import {
  useDeliveryStore,
  type DeliveryItem,
  type DeliveryNote,
} from "../../../zustand/deliveryStore";
import { useSupplyStore } from "../../../zustand/supplyStore"; // Import Supply Store
import { useMachineStore } from "../../../zustand/machineStore"; // Import Machine Store
import { useFertilizerStore } from "../../../zustand/fertilizerStore";
import { usePesticideStore } from "../../../zustand/pesticideStore";

// Dữ liệu tĩnh
const warehouseTypes = [
  {
    icon: <IconBuildingFactory size={32} />,
    title: "Kho lạnh",
    desc: "Bảo quản thực phẩm, dược phẩm",
  },
  {
    icon: <IconMapPin size={32} />,
    title: "Kho khô",
    desc: "Lưu trữ vật tư thông thường",
  },
  {
    icon: <IconBuildingFactory size={32} />,
    title: "Kho nguyên liệu",
    desc: "Nguyên liệu cho sản xuất",
  },
  {
    icon: <IconUser size={32} />,
    title: "Kho tự quản",
    desc: "Doanh nghiệp quản lý riêng",
  },
];

const assetTypes = [
  {
    label: "Thuốc BVTV",
    value: "Thuốc bảo vệ thực vật",
    icon: <IconSpray size={18} />,
  },
  { label: "Vật tư", value: "Vật tư", icon: <IconTools size={18} /> },
  { label: "Phân bón", value: "Phân bón", icon: <IconPlant2 size={18} /> },
  { label: "Máy móc", value: "Máy móc", icon: <IconTractor size={18} /> },
];

// Dữ liệu mẫu cho Select Đơn vị & Quy cách
export const UNIT_OPTIONS = [
  "Bao",
  "Chai",
  "Gói",
  "Thùng",
  "Tấn",
  "Kg",
  "Lít",
  "Cái",
  "Bộ",
];
export const PACKING_OPTIONS = [
  "25kg/bao",
  "50kg/bao",
  "10kg/bao",
  "1 lít/chai",
  "500ml/chai",
  "100ml/chai",
  "Thùng 24 lon",
  "1 bộ/hộp",
];

export default function StockManagementAddDeliveryPage() {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { companies } = useCompanyStore();
  const { areas } = useStockAreaStore();
  const { addDelivery, isLoading } = useDeliveryStore();
  const { supplies } = useSupplyStore(); // Lấy danh sách vật tư
  const { machines } = useMachineStore(); // Lấy danh sách máy móc
  const { fertilizers } = useFertilizerStore();
  const { pesticides } = usePesticideStore();
  const [active, setActive] = useState(0);

  // States cho Bước 1 (Chọn vị trí)
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    null
  );
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [selectedSubAreaId, setSelectedSubAreaId] = useState<string | null>(
    null
  );

  // States cho Bước 2 (Hàng hóa)
  const [selectedWarehouseType, setSelectedWarehouseType] = useState<
    string | null
  >(null);
  const [inputMode, setInputMode] = useState<"upload" | "manual">("upload");
  const [items, setItems] = useState<DeliveryItem[]>([]);

  // State cho Select Creatable
  const [unitData, setUnitData] = useState(UNIT_OPTIONS);
  const [packingData, setPackingData] = useState(PACKING_OPTIONS);

  // Form thêm hàng thủ công
  const [manualItem, setManualItem] = useState<DeliveryItem>({
    group: "",
    name: "",
    quantity: 1,
    unit: "",
    packing: "",
  });

  // Form chính (Tên kho)
  const form = useForm({
    initialValues: {
      warehouseName: "",
      code: "NK-" + Math.floor(Math.random() * 10000),
    },
    validate: {
      warehouseName: (val) =>
        val.trim().length < 3 ? "Tên kho quá ngắn" : null,
    },
  });

  // --- COMPUTED VALUES ---
  const selectedPartner = useMemo(
    () => companies.find((c) => c.id === selectedPartnerId),
    [companies, selectedPartnerId]
  );
  const selectedArea = useMemo(
    () => areas.find((a) => a.id === selectedAreaId),
    [areas, selectedAreaId]
  );
  const selectedSubArea = useMemo(
    () => selectedArea?.subAreas?.find((s) => s.id === selectedSubAreaId),
    [selectedArea, selectedSubAreaId]
  );

  // --- LOGIC LỌC SẢN PHẨM THEO NHÓM ---
  const filteredProducts = useMemo(() => {
    if (!manualItem.group) return [];

    if (manualItem.group === "Máy móc") {
      // Lấy từ Store Máy móc
      return machines.map((m) => ({
        value: m.name, // Dùng tên làm value để lưu vào form
        label: m.name,
        image: m.image,
        unit: "Cái", // Mặc định cho máy móc
        type: "Máy móc",
      }));
    }
    if (manualItem.group === "Vật tư") {
      console.log(supplies);
      return supplies.map((s) => ({
        value: s.name,
        label: s.name,
        image: s.image,
        unit: "", // Lấy đơn vị có sẵn từ kho
        type: s.type,
      }));
    }
    if (manualItem.group === "BVTV") {
      return pesticides.map((s) => ({
        value: s.name,
        label: s.name,
        image: s.image,
        unit: "", // Lấy đơn vị có sẵn từ kho
        type: "",
      }));
    }
    if (manualItem.group === "Phân bón") {
      return fertilizers.map((s) => ({
        value: s.name,
        label: s.name,
        image: s.image,
        unit: "", // Lấy đơn vị có sẵn từ kho
        type: "",
      }));
    }
  }, [manualItem.group, supplies, machines]);

  // --- CONFIG TABLE COLUMNS ---
  const itemColumns = useMemo<MRT_ColumnDef<DeliveryItem>[]>(
    () => [
      {
        accessorKey: "group",
        header: "Nhóm hàng",
        size: 120,
        Cell: ({ cell }) => (
          <Badge variant="light" color="blue">
            {cell.getValue<string>()}
          </Badge>
        ),
      },
      {
        accessorKey: "name",
        header: "Tên hàng hóa",
        size: 200,
        Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
      },
      {
        accessorKey: "quantity",
        header: "Số lượng",
        size: 100,
        Cell: ({ row }) => (
          <Text>
            {row.original.quantity} {row.original.unit}
          </Text>
        ),
      },
      {
        accessorKey: "packing",
        header: "Quy cách",
      },
    ],
    []
  );

  // --- HANDLERS ---

  // Giả lập upload file Excel
  const handleUploadFile = (file: File | null) => {
    if (!file) return;
    // Giả lập parsing file
    setTimeout(() => {
      setItems([
        {
          group: "Phân bón",
          name: "Phân NPK 16-16-8",
          quantity: 100,
          unit: "bao",
          packing: "25kg/bao",
        },
        {
          group: "BVTV",
          name: "Thuốc trừ sâu",
          quantity: 30,
          unit: "chai",
          packing: "100ml",
        },
        {
          group: "Máy móc",
          name: "Máy xịt thuốc",
          quantity: 2,
          unit: "cái",
          packing: "1 bộ",
        },
      ]);
      notifications.show({
        message: "Đã nhập dữ liệu từ file Excel",
        color: "green",
      });
    }, 500);
  };

  // Thêm hàng thủ công
  const handleAddManualItem = () => {
    if (!manualItem.name || !manualItem.group) {
      notifications.show({
        message: "Vui lòng nhập tên và nhóm hàng",
        color: "red",
      });
      return;
    }
    setItems([...items, { ...manualItem }]);
    setManualItem({ group: "", name: "", quantity: 1, unit: "", packing: "" }); // Reset form
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Chuyển bước
  const nextStep = () => {
    if (active === 0) {
      if (!selectedPartnerId) {
        notifications.show({
          message: "Vui lòng chọn doanh nghiệp",
          color: "red",
        });
        return;
      }
      if (!selectedAreaId) {
        notifications.show({ message: "Vui lòng chọn khu vực", color: "red" });
        return;
      }
    }
    if (active === 1) {
      if (!form.values.warehouseName) {
        form.setFieldError("warehouseName", "Vui lòng nhập tên kho");
        return;
      }
      if (!selectedWarehouseType) {
        notifications.show({ message: "Vui lòng chọn loại kho", color: "red" });
        return;
      }
      if (items.length === 0) {
        notifications.show({
          message: "Vui lòng thêm ít nhất 1 mặt hàng",
          color: "red",
        });
        return;
      }
    }
    setActive((cur) => Math.min(cur + 1, 3));
  };

  const prevStep = () => setActive((cur) => Math.max(cur - 1, 0));

  // Submit Final
  const handleFinish = async () => {
    const payload: Omit<DeliveryNote, "id" | "createdAt"> = {
      code: form.values.code,
      type: "Import",
      partnerId: selectedPartnerId!,
      partnerName: selectedPartner?.name || "N/A",
      areaId: selectedAreaId!,
      areaName: selectedArea?.name || "N/A",
      subAreaId: selectedSubAreaId || undefined,
      subAreaName: selectedSubArea?.note || undefined,
      warehouseName: form.values.warehouseName,
      warehouseType: selectedWarehouseType!,
      items: items,
    };

    const success = await addDelivery(payload);
    if (success) {
      notifications.show({
        title: "Thành công",
        message: "Đã tạo phiếu nhập kho",
        color: "green",
        icon: <IconCheck />,
      });
      setActive(3); // Done step
    }
  };

  return (
    <Card withBorder shadow="sm" radius={4} p="lg" pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo mới kho vận (Nhập kho)</Title>
      </Group>

      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        size="md"
      >
        {/* --- BƯỚC 1: VỊ TRÍ --- */}
        <Stepper.Step label="Bước 1" description="Xác định vị trí">
          <Stack gap="xs">
            <TextInput
              label="Doanh nghiệp / nông hộ"
              placeholder="Tìm kiếm doanh nghiệp"
              leftSection={<IconSearch size={18} />}
              radius={4}
            />
            <SelectableEnterpriseCards
              isCheckbox={true}
              isMulti={false}
              value={selectedPartnerId ? [selectedPartnerId] : []}
              onChange={(ids) => setSelectedPartnerId(ids[0] || null)}
            />

            <Text fw={500} fz={15} mt="sm">
              Khu vực chính
            </Text>
            {areas.length === 0 ? (
              <Text c="dimmed">
                Chưa có khu vực nào. Vui lòng tạo khu vực trước.
              </Text>
            ) : (
              <Grid>
                {areas.map((area) => (
                  <Grid.Col span={{ base: 12, sm: 6 }} key={area.id}>
                    <Card
                      withBorder
                      shadow="xs"
                      radius="md"
                      style={{
                        cursor: "pointer",
                        borderColor:
                          selectedAreaId === area.id ? "green" : undefined,
                        borderWidth: selectedAreaId === area.id ? 2 : 1,
                      }}
                      onClick={() => {
                        setSelectedAreaId(area.id);
                        setSelectedSubAreaId(null);
                      }}
                    >
                      <Group justify="apart">
                        <Text fw={600}>{area.name}</Text>
                        <Badge color="blue">{area.id}</Badge>
                      </Group>
                      <Text size="sm" mt={4}>
                        📍 {area.latitude}, {area.longitude}
                      </Text>
                      <Text size="sm">📏 {area.area} m²</Text>
                      <Text size="sm" color="dimmed">
                        {area.note}
                      </Text>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}

            {/* Hiển thị SubArea nếu Area đã chọn có SubArea */}
            {selectedArea && selectedArea.subAreas?.length > 0 && (
              <Stack gap={"xs"} mt="sm">
                <Text fw={500} fz={15}>
                  Khu vực phụ thuộc {selectedArea.name}
                </Text>
                <Stack>
                  <Group>
                    {selectedArea.subAreas.map((sub) => (
                      <AreaCard
                        isCheckbox
                        key={sub.id}
                        id={sub.id}
                        name={`Khu phụ ${sub.id}`}
                        latitude={sub.latitude}
                        longitude={sub.longitude}
                        areaSize={sub.area}
                        selected={selectedSubAreaId === sub.id}
                        onToggle={() =>
                          setSelectedSubAreaId(
                            sub.id === selectedSubAreaId ? null : sub.id
                          )
                        }
                      />
                    ))}
                  </Group>
                </Stack>
              </Stack>
            )}

            <Group justify="right" mt="md">
              <Button onClick={nextStep} radius={4}>
                Tiếp theo
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        {/* --- BƯỚC 2: HÀNG HÓA --- */}
        <Stepper.Step label="Bước 2" description="Thông tin vật tư">
          <Stack gap="xs">
            <Card withBorder shadow="xs" radius={4} p="xs" bg="gray.0">
              <Center>
                <Group gap="sm">
                  <IconMapPin size={20} color="green" />
                  <Text fw={600}>
                    {selectedPartner?.name} &rarr; {selectedArea?.name}{" "}
                    {selectedSubArea
                      ? `&rarr; Khu phụ ${selectedSubArea.id}`
                      : ""}
                  </Text>
                </Group>
              </Center>
            </Card>

            <Card withBorder radius="md" shadow="sm" p="md">
              <Stack>
                <TextInput
                  label="Tên Kho / Lô hàng"
                  placeholder="Ví dụ: Kho A - Nhập đợt 1"
                  withAsterisk
                  radius={4}
                  {...form.getInputProps("warehouseName")}
                />

                <Input.Wrapper label="Loại kho" withAsterisk>
                  <ScrollArea type="always" offsetScrollbars>
                    <Flex gap="md" py="xs" wrap="nowrap">
                      {warehouseTypes.map((w, idx) => (
                        <Card
                          key={idx}
                          shadow="sm"
                          padding="md"
                          radius="md"
                          withBorder
                          style={{
                            width: 180,
                            minWidth: 180,
                            cursor: "pointer",
                            borderColor:
                              selectedWarehouseType === w.title
                                ? "green"
                                : undefined,
                            borderWidth:
                              selectedWarehouseType === w.title ? 2 : 1,
                          }}
                          onClick={() => setSelectedWarehouseType(w.title)}
                        >
                          <Stack align="center" justify="center" gap={4}>
                            {w.icon}
                            <Text size="sm" fw={600} ta="center">
                              {w.title}
                            </Text>
                          </Stack>
                        </Card>
                      ))}
                    </Flex>
                  </ScrollArea>
                </Input.Wrapper>

                <SegmentedControl
                  radius={4}
                  fullWidth
                  value={inputMode}
                  onChange={(val) => setInputMode(val as "upload" | "manual")}
                  data={[
                    { label: "Upload file Excel", value: "upload" },
                    { label: "Nhập thủ công", value: "manual" },
                  ]}
                />

                {inputMode === "upload" && (
                  <Stack gap={"xs"}>
                    <Group justify="apart">
                      <FileButton
                        onChange={handleUploadFile}
                        accept=".xlsx,.xls"
                      >
                        {(props) => (
                          <Button
                            radius={4}
                            {...props}
                            leftSection={<IconDownload size={16} />}
                          >
                            Upload file Excel
                          </Button>
                        )}
                      </FileButton>
                      <Text size="sm" color="dimmed">
                        Chấp nhận .xlsx, .xls
                      </Text>
                    </Group>
                  </Stack>
                )}

                {inputMode === "manual" && (
                  <Stack
                    gap="xs"
                    p="sm"
                    bg="gray.0"
                    style={{ borderRadius: 8 }}
                  >
                    <Input.Wrapper label="Nhóm hàng hóa">
                      <Group gap="xs">
                        {assetTypes.map((item) => (
                          <Button
                            key={item.label}
                            variant={
                              manualItem.group === item.label
                                ? "filled"
                                : "outline"
                            }
                            color={
                              manualItem.group === item.label ? "green" : "gray"
                            }
                            size="sm"
                            radius="md"
                            leftSection={item.icon}
                            onClick={() =>
                              setManualItem({
                                ...manualItem,
                                group: item.label,
                              })
                            }
                          >
                            {item.label}
                          </Button>
                        ))}
                      </Group>
                    </Input.Wrapper>

                    {/* Thay thế TextInput bằng Select có ảnh */}
                    <Select
                      label="Tên hàng"
                      placeholder={
                        manualItem.group
                          ? "Chọn hàng hóa"
                          : "Vui lòng chọn nhóm trước"
                      }
                      disabled={!manualItem.group}
                      radius={4}
                      searchable
                      data={filteredProducts}
                      value={manualItem.name}
                      onChange={(val) => {
                        const selected = filteredProducts?.find(
                          (p) => p.value === val
                        );
                        setManualItem((prev) => ({
                          ...prev,
                          name: val || "",
                          unit: selected?.unit || prev.unit, // Tự động điền đơn vị nếu có
                        }));
                      }}
                      renderOption={({ option }) => {
                        const item = filteredProducts?.find(
                          (p) => p.value === option.value
                        );
                        return (
                          <Group gap="sm" wrap="nowrap">
                            <Avatar src={item?.image} size="sm" radius="sm" />
                            <div>
                              <Text size="sm" fw={500}>
                                {item?.label}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {item?.type}
                              </Text>
                            </div>
                          </Group>
                        );
                      }}
                    />

                    <Group grow>
                      <NumberInput
                        label="Số lượng"
                        min={1}
                        radius={4}
                        value={manualItem.quantity}
                        onChange={(v) =>
                          setManualItem({ ...manualItem, quantity: Number(v) })
                        }
                      />

                      {/* Select Đơn vị */}
                      <Select
                        label="Đơn vị"
                        placeholder="Chọn đơn vị"
                        data={unitData}
                        searchable
                        radius={4}
                        value={manualItem.unit}
                        onChange={(val) =>
                          setManualItem({ ...manualItem, unit: val || "" })
                        }
                      />
                    </Group>

                    {/* Select Quy cách */}
                    <Select
                      label="Quy cách"
                      placeholder="Chọn quy cách"
                      data={packingData}
                      searchable
                      radius={4}
                      value={manualItem.packing}
                      onChange={(val) =>
                        setManualItem({ ...manualItem, packing: val || "" })
                      }
                    />

                    <Button
                      variant="light"
                      radius={4}
                      onClick={handleAddManualItem}
                      leftSection={<IconPlus size={16} />}
                    >
                      Thêm vào danh sách
                    </Button>
                  </Stack>
                )}

                <Divider
                  label={`Danh sách hàng hóa (${items.length})`}
                  labelPosition="center"
                  my="sm"
                />

                <Grid gutter="sm">
                  {items.map((item, index) => (
                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={index}>
                      <Card shadow="sm" radius="md" withBorder p="sm">
                        <Group justify="space-between" mb={4}>
                          <Badge color="green" variant="light">
                            {item.group}
                          </Badge>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Group>
                        <Text fw={600} lineClamp={1} title={item.name}>
                          {item.name}
                        </Text>
                        <Text size="sm">
                          SL: {item.quantity} {item.unit}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {item.packing}
                        </Text>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              </Stack>
            </Card>

            <Group justify="space-between">
              <Button radius={4} variant="default" onClick={prevStep}>
                Quay lại
              </Button>
              <Button radius={4} onClick={nextStep}>
                Tiếp theo
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        {/* --- BƯỚC 3: XÁC NHẬN --- */}
        <Stepper.Step label="Bước 3" description="Xác nhận">
          <Stack gap="lg">
            <Title order={3}>🗂️ Xác nhận nhập kho</Title>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {/* Thông tin kho */}
              <Card withBorder radius="md" shadow="sm" p="md">
                <Title order={5} mb="xs">
                  📍 Vị trí lưu trữ
                </Title>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text c="dimmed" size="sm">
                      Tên kho:
                    </Text>
                    <Text fw={500}>{form.values.warehouseName}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text c="dimmed" size="sm">
                      Loại kho:
                    </Text>
                    <Badge>{selectedWarehouseType}</Badge>
                  </Group>
                  <Divider variant="dashed" />
                  <Group justify="space-between">
                    <Text c="dimmed" size="sm">
                      Khu vực:
                    </Text>
                    <Text fw={500}>{selectedArea?.name}</Text>
                  </Group>
                  {selectedSubArea && (
                    <Group justify="space-between">
                      <Text c="dimmed" size="sm">
                        Khu phụ:
                      </Text>
                      <Text fw={500}>ID {selectedSubArea.id}</Text>
                    </Group>
                  )}
                </Stack>
              </Card>

              {/* Doanh nghiệp */}
              <Card withBorder radius="md" shadow="sm" p="md">
                <Title order={5} mb="xs">
                  🏢 Đối tác cung cấp
                </Title>
                <Stack gap="xs">
                  <Text fw={600} size="lg">
                    {selectedPartner?.name}
                  </Text>
                  <Text size="sm">
                    <strong>Đại diện:</strong> {selectedPartner?.representative}
                  </Text>
                  <Text size="sm">
                    <strong>SĐT:</strong> {selectedPartner?.phone}
                  </Text>
                  <Text size="sm">
                    <strong>Địa chỉ:</strong> {selectedPartner?.address}
                  </Text>
                </Stack>
              </Card>
            </SimpleGrid>

            <Divider
              label={`Danh sách hàng hóa (${items.length})`}
              labelPosition="center"
            />

            {/* --- TABLE HÀNG HÓA --- */}
            {items.length === 0 ? (
              <Text color="dimmed" ta="center">
                Chưa có hàng hóa.
              </Text>
            ) : (
              <Table
                //@ts-expect-error no check
                data={items}
                //@ts-expect-error no check
                columns={itemColumns}
              />
            )}

            <Group justify="space-between" mt="lg">
              <Button variant="default" radius={4} onClick={prevStep}>
                Quay lại
              </Button>
              <Button
                radius={4}
                color="green"
                onClick={handleFinish}
                loading={isLoading}
              >
                Hoàn thành
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        {/* --- HOÀN TẤT --- */}
        <Stepper.Completed>
          <Stack align="center" justify="center" mt="xl">
            <IconCheck size={60} color="green" />
            <Text fz={"h2"} ta="center">
              Nhập kho thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Phiếu nhập <b>{form.values.code}</b> đã được tạo.
            </Text>
            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Quay về danh sách
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>
    </Card>
  );
}
