import {
  Button,
  Group,
  Stepper,
  Select,
  Stack,
  Card,
  Title,
  Text,
  Badge,
  Divider,
  Accordion,
  Modal,
  SimpleGrid,
  Checkbox,
  TextInput,
  Radio,
  MultiSelect,
  Image,
  Textarea,
  SegmentedControl,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconCalendar,
  IconCertificate,
  IconSearch,
  IconShieldCheck,
  IconUser,
} from "@tabler/icons-react";
import { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegionCardSelector from "./components/RegionCards";
import SeedCards from "./components/SeedCards";
import LotCard from "./components/LotCard";
import { useDisclosure } from "@mantine/hooks";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import CertificateCardList from "./components/CertificateCards";
import {
  useRegionStore,
  type RegionEntity,
} from "../../../zustand/regionStore";
import { usePlotStore } from "../../../zustand/plotStore";
import { useDepartmentStore } from "../../../zustand/departmentStore";
import { usePositionStore } from "../../../zustand/positionStore";
import { useSeedStore, type Seed } from "../../../zustand/seedStore";
import { useTreeStore } from "../../../zustand/treeStore";
import { useCertificateStore } from "../../../zustand/certificateStore";
import { useAreaSetupStore } from "../../../zustand/areaSetupStore";

// --- Types Definition ---

// Cấu hình chi tiết cho một đơn vị (Vùng/Khu vực/Lô)
type CultivationConfig = {
  id: string; // Mã code của Vùng/Khu vực/Lô
  name: string; // Tên hiển thị
  farmingMethod: string | null;
  irrigationMethod: string | null;
  selectedSeeds: Seed[]; // Danh sách giống đã chọn
};

type FormValues = {
  name: string; // Tên hiển thị chung (nếu cần)
  note: string;
  type: "region" | "area" | "plot"; // Loại thiết lập

  // Selection Data
  region: RegionEntity | null; // Vùng được chọn
  selectedAreaCodes: string[]; // Danh sách mã khu vực được chọn (nếu type != region)
  selectedPlotCodes: string[]; // Danh sách mã lô được chọn (nếu type == plot)

  managers: string[]; // ID nhân viên quản lý
  certificates: string[]; // ID chứng chỉ

  // Logic cốt lõi: Map ID (RegionCode/AreaCode/PlotCode) -> Config
  cultivationDetails: Record<string, CultivationConfig>;
};

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Group gap={8} wrap="nowrap">
      <Text size="sm" c="dimmed" style={{ minWidth: 150 }}>
        {label}:
      </Text>
      <Text size="sm">{value}</Text>
    </Group>
  );
}

const AreaManagementAddRegionPage = () => {
  const navigate = useNavigate();
  // Zustand Stores
  const { regions } = useRegionStore();
  const { plots } = usePlotStore();
  const { departments } = useDepartmentStore();
  const { positions } = usePositionStore();
  const { seeds } = useSeedStore();
  const { certificates } = useCertificateStore();
  const { addSetup } = useAreaSetupStore();

  const [currentEditingEntityId, setCurrentEditingEntityId] = useState<
    string | null
  >(null);

  const [active, setActive] = useState(0);
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [openedFilterTree, setOpenedFilterTree] = useState(false);
  const [openedFilterMultiple, setOpenedFilterMultiple] = useState(false);
  const [openedLotModal, { toggle: toggleLotModal }] = useDisclosure(false);
  const [mode, setMode] = useState<"group" | "dept">("group"); // Filter mode nhân viên

  // --- Form Initialization ---
  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      note: "",
      type: "region",
      region: null,
      selectedAreaCodes: [],
      selectedPlotCodes: [],
      managers: [],
      certificates: [],
      cultivationDetails: {},
    },
    validate: (values) => {
      return {};
    },
  });

  // --- Derived State (Logic tính toán) ---

  // Lấy danh sách Plot dựa trên Region đã chọn (cho Modal chọn Lô)
  const availablePlots = useMemo(() => {
    if (!form.values.region) return [];
    const areaCodes = form.values.region.areas.map((a) => a.code);
    return plots.filter((p) => areaCodes.includes(p.plot.areaCode));
  }, [form.values.region, plots]);

  // Lấy danh sách Area dựa trên Region đã chọn (cho Step 1 & 2)
  const availableAreas = useMemo(() => {
    return form.values.region?.areas || [];
  }, [form.values.region]);

  // --- Handlers ---
  const selectedCertificates = useMemo(
    () =>
      certificates.filter((c) =>
        form.values.certificates.includes(c.id as string)
      ),
    [certificates, form.values.certificates]
  );
  const handleNextStep = () => {
    const validation = form.validate();
    if (!validation.hasErrors) {
      // Init cultivationDetails data structure khi chuyển sang bước 2
      if (active === 0) {
        initializeCultivationDetails();
      }
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };

  const handlePrevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  // Khởi tạo object cultivationDetails dựa trên type và selection
  const initializeCultivationDetails = () => {
    const currentDetails = { ...form.values.cultivationDetails };
    const { type, region, selectedAreaCodes, selectedPlotCodes } = form.values;

    if (!region) return;

    let targetEntities: { id: string; name: string }[] = [];

    if (type === "region") {
      targetEntities = [
        { id: region.region.codeSystem, name: region.region.name },
      ];
    } else if (type === "area") {
      targetEntities = availableAreas
        .filter((a) => selectedAreaCodes.includes(a.code))
        .map((a) => ({ id: a.code, name: a.name }));
    } else if (type === "plot") {
      targetEntities = availablePlots
        .filter((p) => selectedPlotCodes.includes(p.plot.code))
        .map((p) => ({ id: p.plot.code, name: p.plot.name }));
    }

    targetEntities.forEach((entity) => {
      if (!currentDetails[entity.id]) {
        currentDetails[entity.id] = {
          id: entity.id,
          name: entity.name,
          farmingMethod: "Truyền thống", // Default
          irrigationMethod: null,
          selectedSeeds: [],
        };
      }
    });

    form.setFieldValue("cultivationDetails", currentDetails);
  };

  const handleUpdateConfig = (
    id: string,
    field: keyof CultivationConfig,
    value: any
  ) => {
    form.setFieldValue(`cultivationDetails.${id}.${field}`, value);
  };

  const handleSelectSeedForEntity = (seed: Seed) => {
    if (!currentEditingEntityId) return;

    const currentSeeds =
      form.values.cultivationDetails[currentEditingEntityId]?.selectedSeeds ||
      [];
    // Kiểm tra trùng
    if (!currentSeeds.find((s) => s.id === seed.id)) {
      handleUpdateConfig(currentEditingEntityId, "selectedSeeds", [
        ...currentSeeds,
        seed,
      ]);
    }
    // Không đóng modal ngay nếu là multiple, logic tùy chỉnh
    if (!openedFilterMultiple) {
      setOpenedFilterTree(false);
    }
  };

  const removeSeedFromEntity = (entityId: string, seedId: string) => {
    const currentSeeds =
      form.values.cultivationDetails[entityId]?.selectedSeeds || [];
    handleUpdateConfig(
      entityId,
      "selectedSeeds",
      currentSeeds.filter((s) => s.id !== seedId)
    );
  };

  const handleSubmit = () => {
    const values = form.getValues();
    if (!values.region) return;

    const setupId = addSetup({
      name: values.name,
      note: values.note,
      type: values.type,
      regionId: values.region.id,
      areaCodes: values.selectedAreaCodes,
      plotCodes: values.selectedPlotCodes,
      managerIds: values.managers,
      certificateIds: values.certificates,
      details: Object.fromEntries(
        Object.entries(values.cultivationDetails).map(([key, config]) => [
          key,
          {
            id: config.id,
            name: config.name,
            farmingMethod: config.farmingMethod,
            irrigationMethod: config.irrigationMethod,
            seedIds: config.selectedSeeds.map((item) => item.id),
          },
        ])
      ),
    });

    form.reset();
    navigate(-1);
    setCurrentEditingEntityId(null);
    setOpenedFilterTree(false);
    setOpenedFilterMultiple(false);

    console.log("Created setup id:", setupId);
  };

  // --- UI Renders ---

  return (
    <Card withBorder shadow="sm" radius={4} p="lg">
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Thêm mới vùng trồng theo từng bước</Title>
      </Group>

      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Bước 1" description="Vùng trồng" />
        <Stepper.Step label="Bước 2" description="Cây trồng" />
        <Stepper.Step label="Bước 3" description="Xác nhận" />
        <Stepper.Completed>
          {/* Giữ nguyên UI Completed */}
          <Stack align="center" justify="center" mt="xl">
            <Image
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPNbBpZeXnXfTuA6AWek-Kj8NYEVbYdG6ayi5bIWarDuryXDrILdKMTd597quLD0PBKM&usqp=CAU"
              }
              w={200}
              fit="cover"
            />
            <Text fz={"h2"} ta="center">
              Thêm vùng trồng mới thành công!
            </Text>
            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {/* --- STEP 1: BASIC INFO --- */}
        {active === 0 && (
          <Stack mt="md">
            <Stack gap={"xs"}>
              <SegmentedControl
                data={[
                  { label: "Thiết lập theo vùng", value: "region" },
                  { label: "Thiết lập theo khu vực", value: "area" },
                  { label: "Thiết lập theo lô", value: "plot" },
                ]}
                {...form.getInputProps("type")}
                radius={4}
              />
              <TextInput
                radius={4}
                label="Vùng canh tác"
                placeholder="Nhập tên gợi nhớ cho thiết lập này"
                {...form.getInputProps("name")}
              />
              <CertificateCardList
                selected={form.values.certificates}
                onChange={(ids) => form.setFieldValue("certificates", ids)}
              />

              <Text fw={500} size="sm">
                Vùng trồng <span style={{ color: "red" }}>*</span>
              </Text>
              {/* Region Selector */}
              <RegionCardSelector
                regions={regions}
                selected={form.values.region?.region.codeSystem || ""}
                onSelect={({ clicked }) => {
                  form.setFieldValue("region", clicked);
                  form.setFieldValue("selectedAreaCodes", []);
                  form.setFieldValue("selectedPlotCodes", []);
                  form.setFieldValue("cultivationDetails", {});
                }}
              />
              {form.errors.region && (
                <Text c="red" size="xs">
                  {form.errors.region}
                </Text>
              )}
            </Stack>

            {/* Area Selector (Multi) */}
            {form.values.type !== "region" && form.values.region && (
              <Stack gap={"xs"}>
                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Khu vực trồng <span style={{ color: "red" }}>*</span>
                  </Text>
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => {
                      // Logic chọn tất cả area
                      const allCodes = availableAreas.map((a) => a.code);
                      form.setFieldValue("selectedAreaCodes", allCodes);
                    }}
                  >
                    Chọn tất cả
                  </Button>
                </Group>

                <RegionCardSelector
                  isMultiSelect
                  regions={
                    availableAreas.map((item) => ({
                      region: {
                        ...item,
                        codeSystem: item.code,
                        companyIds: [],
                      },
                      id: item.code,
                      areas: [],
                      coords: [],
                    })) as any[]
                  }
                  selected={form.values.selectedAreaCodes}
                  onSelect={({ selectedIds }) => {
                    form.setFieldValue("selectedAreaCodes", selectedIds);
                  }}
                />
                {/* Hiển thị tạm danh sách đã chọn để debug/user thấy */}
                {form.values.selectedAreaCodes.length > 0 && (
                  <Text size="xs" c="dimmed">
                    Đã chọn: {form.values.selectedAreaCodes.length} khu vực
                  </Text>
                )}
              </Stack>
            )}

            {/* Plot Selector (Multi) */}
            {form.values.type === "plot" && form.values.region && (
              <Stack gap={"xs"}>
                <Group justify="space-between">
                  <Text fw={500} fz={15}>
                    Lô trồng <span style={{ color: "red" }}>*</span>
                  </Text>
                  <Button variant="default" size="xs" onClick={toggleLotModal}>
                    Mở danh sách chọn nhanh
                  </Button>
                </Group>

                {/* Hiển thị các lô đã chọn dưới dạng Card */}
                {form.values.selectedPlotCodes.length > 0 ? (
                  <Card withBorder>
                    <Stack>
                      <Text fw={"bold"}>Danh sách lô đã chọn</Text>
                      <Group>
                        {availablePlots
                          .filter((p) =>
                            form.values.selectedPlotCodes.includes(p.plot.code)
                          )
                          .map((lot) => (
                            <LotCard
                              key={lot.plot.code}
                              lotCode={lot.plot.code}
                              lotName={lot.plot.name}
                              area={lot.plot.area}
                              elevationInfo={lot.plot.elevation.toString()}
                              selected={true}
                              onToggle={() => {
                                // Bỏ chọn
                                form.setFieldValue(
                                  "selectedPlotCodes",
                                  form.values.selectedPlotCodes.filter(
                                    (c) => c !== lot.plot.code
                                  )
                                );
                              }}
                              closable={true}
                              isCheckbox={false}
                            />
                          ))}
                      </Group>
                    </Stack>
                  </Card>
                ) : (
                  <Text size="sm" c="dimmed" fs="italic">
                    Chưa chọn lô nào
                  </Text>
                )}
              </Stack>
            )}

            <Group>
              <Text fw={"500"} fz={15}>
                Nhân viên quản lý
              </Text>
              <Button
                variant="light"
                radius={4}
                onClick={openFilterEmployee}
                leftSection={<IconUser size={18} />}
              >
                Chọn nhân viên
              </Button>
            </Group>
            <EmployeeCardList
              isMultiple
              isTouchable
              selectedIds={form.values.managers}
              onToggle={(employee) => {
                const currentIds = form.values.managers;

                if (currentIds.includes(employee.id)) {
                  // Case 1: ID exists -> Remove it using filter
                  form.setFieldValue(
                    "managers",
                    currentIds.filter((id) => id !== employee.id)
                  );
                } else {
                  // Case 2: ID does not exist -> Add it
                  form.setFieldValue("managers", [...currentIds, employee.id]);
                }
              }}
            />

            <Textarea
              label="Ghi chú"
              placeholder="Ghi chú về vùng trồng"
              radius={4}
              {...form.getInputProps("note")}
            />
          </Stack>
        )}

        {/* --- STEP 2: CULTIVATION CONFIG --- */}
        {active === 1 && (
          <Stack mt={"md"}>
            {/* Info Only Segmented Control - disable change here to avoid data loss */}
            <SegmentedControl
              data={[
                {
                  label: "Thiết lập theo vùng",
                  value: "region",
                  disabled: form.values.type !== "region",
                },
                {
                  label: "Thiết lập theo khu vực",
                  value: "area",
                  disabled: form.values.type !== "area",
                },
                {
                  label: "Thiết lập theo lô",
                  value: "plot",
                  disabled: form.values.type !== "plot",
                },
              ]}
              value={form.values.type}
              readOnly
              radius={4}
            />

            {/* --- CASE 1: PLOT MODE --- */}
            {form.values.type === "plot" && (
              <Stack mt="md" gap="md">
                <Card withBorder radius={4} shadow="sm" p="md">
                  <Stack>
                    <Text fw={"bold"} fz={"h4"}>
                      Cấu hình cho từng Lô
                    </Text>
                    <Divider />
                    <Accordion
                      variant="contained"
                      radius={4}
                      multiple
                      defaultValue={form.values.selectedPlotCodes}
                    >
                      {form.values.selectedPlotCodes.map((plotId) => {
                        const config = form.values.cultivationDetails[plotId];
                        if (!config) return null;
                        return (
                          <Accordion.Item key={plotId} value={plotId}>
                            <Accordion.Control>
                              {config.name} ({plotId})
                            </Accordion.Control>
                            <Accordion.Panel>
                              <Stack gap="xs" mt="sm">
                                <Select
                                  searchable
                                  clearable
                                  label="Phương pháp canh tác"
                                  data={[
                                    "Xen canh",
                                    "Truyền thống",
                                    "Công nghệ cao",
                                  ]}
                                  value={config.farmingMethod}
                                  onChange={(val) =>
                                    handleUpdateConfig(
                                      plotId,
                                      "farmingMethod",
                                      val
                                    )
                                  }
                                  radius={4}
                                />
                                <Select
                                  searchable
                                  clearable
                                  label="Phương pháp tưới tiêu"
                                  data={[
                                    "Tưới nhỏ giọt",
                                    "Tưới phun mưa",
                                    "Tưới tràn",
                                  ]}
                                  value={config.irrigationMethod}
                                  onChange={(val) =>
                                    handleUpdateConfig(
                                      plotId,
                                      "irrigationMethod",
                                      val
                                    )
                                  }
                                  radius={4}
                                />
                                <Group>
                                  <Text fw={500} fz={14}>
                                    Giống cây trồng
                                  </Text>
                                  <Button
                                    radius={4}
                                    variant="outline"
                                    size="xs"
                                    onClick={() => {
                                      setCurrentEditingEntityId(plotId);
                                      setOpenedFilterTree(true);
                                      setOpenedFilterMultiple(true);
                                    }}
                                  >
                                    Thêm mới
                                  </Button>
                                </Group>
                                <SeedCards
                                  selected=""
                                  seeds={config.selectedSeeds}
                                  onSelect={(seed) =>
                                    removeSeedFromEntity(plotId, seed.id)
                                  } // click để xoá
                                  isDelete
                                  isTouchable={true}
                                />
                              </Stack>
                            </Accordion.Panel>
                          </Accordion.Item>
                        );
                      })}
                    </Accordion>
                  </Stack>
                </Card>
              </Stack>
            )}

            {/* --- CASE 2: AREA MODE --- */}
            {form.values.type === "area" && (
              <Stack mt="md" gap="md">
                <Card withBorder radius={4} shadow="sm" p="md">
                  <Stack>
                    <Text fw={"bold"} fz={"h4"}>
                      Cấu hình cho từng Khu vực
                    </Text>
                    <Divider />
                    <Accordion
                      variant="contained"
                      radius={4}
                      multiple
                      defaultValue={form.values.selectedAreaCodes}
                    >
                      {form.values.selectedAreaCodes.map((areaId) => {
                        const config = form.values.cultivationDetails[areaId];
                        if (!config) return null;
                        return (
                          <Accordion.Item key={areaId} value={areaId}>
                            <Accordion.Control>{config.name}</Accordion.Control>
                            <Accordion.Panel>
                              <Stack gap="xs" mt="sm">
                                <Select
                                  searchable
                                  clearable
                                  label="Phương pháp canh tác"
                                  data={[
                                    "Xen canh",
                                    "Truyền thống",
                                    "Công nghệ cao",
                                  ]}
                                  value={config.farmingMethod}
                                  onChange={(val) =>
                                    handleUpdateConfig(
                                      areaId,
                                      "farmingMethod",
                                      val
                                    )
                                  }
                                  radius={4}
                                />
                                <Select
                                  searchable
                                  clearable
                                  label="Phương pháp tưới tiêu"
                                  data={[
                                    "Tưới nhỏ giọt",
                                    "Tưới phun mưa",
                                    "Tưới tràn",
                                  ]}
                                  value={config.irrigationMethod}
                                  onChange={(val) =>
                                    handleUpdateConfig(
                                      areaId,
                                      "irrigationMethod",
                                      val
                                    )
                                  }
                                  radius={4}
                                />
                                <Group>
                                  <Text fw={500} fz={14}>
                                    Giống cây trồng
                                  </Text>
                                  <Button
                                    radius={4}
                                    variant="outline"
                                    size="xs"
                                    onClick={() => {
                                      setCurrentEditingEntityId(areaId);
                                      setOpenedFilterMultiple(true);
                                      setOpenedFilterTree(true);
                                    }}
                                  >
                                    Thêm mới
                                  </Button>
                                </Group>
                                <SeedCards
                                  isDelete
                                  selected=""
                                  seeds={config.selectedSeeds}
                                  onSelect={(seed) =>
                                    removeSeedFromEntity(areaId, seed.id)
                                  }
                                  isTouchable={true}
                                />
                              </Stack>
                            </Accordion.Panel>
                          </Accordion.Item>
                        );
                      })}
                    </Accordion>
                  </Stack>
                </Card>
              </Stack>
            )}

            {/* --- CASE 3: REGION MODE --- */}
            {form.values.type === "region" && form.values.region && (
              <Stack mt="md" gap="md">
                <Card withBorder radius={4} shadow="sm" p="md">
                  {(() => {
                    const regionId = form.values.region!.region.codeSystem;
                    const config = form.values.cultivationDetails[regionId];
                    if (!config) return <Text>Đang khởi tạo...</Text>;
                    return (
                      <Stack gap="xs">
                        <Select
                          searchable
                          clearable
                          label="Phương pháp canh tác"
                          data={["Xen canh", "Truyền thống", "Công nghệ cao"]}
                          value={config.farmingMethod}
                          onChange={(val) =>
                            handleUpdateConfig(regionId, "farmingMethod", val)
                          }
                          radius={4}
                        />
                        <Select
                          searchable
                          clearable
                          label="Phương pháp tưới tiêu"
                          data={["Tưới nhỏ giọt", "Tưới phun mưa", "Tưới tràn"]}
                          value={config.irrigationMethod}
                          onChange={(val) =>
                            handleUpdateConfig(
                              regionId,
                              "irrigationMethod",
                              val
                            )
                          }
                          radius={4}
                        />
                        <Group>
                          <Text fw={"500"} fz={14}>
                            Giống cây trồng
                          </Text>
                          <Button
                            radius={4}
                            variant="outline"
                            size="xs"
                            onClick={() => {
                              setCurrentEditingEntityId(regionId);
                              setOpenedFilterTree(true);
                            }}
                          >
                            Thêm mới
                          </Button>
                        </Group>
                        <SeedCards
                          selected=""
                          seeds={config.selectedSeeds}
                          onSelect={(seed) =>
                            removeSeedFromEntity(regionId, seed.id)
                          }
                          isDelete
                          isTouchable={true}
                        />
                      </Stack>
                    );
                  })()}
                </Card>
              </Stack>
            )}
          </Stack>
        )}

        {/* --- STEP 3: CONFIRMATION --- */}
        {active === 2 && (
          <Stack mt="md" gap="lg">
            <Group grow align="flex-start">
              {/* Thông tin chung */}
              <Card withBorder radius={4} shadow="sm" p="md" h={300}>
                <Title order={5} mb="xs">
                  📌 Thông tin vùng trồng
                </Title>
                <Stack gap="xs">
                  <Text size="sm">
                    <strong>Vùng:</strong> {form.values.region?.region.name}
                  </Text>
                  <Text size="sm">
                    <strong>Loại thiết lập:</strong>{" "}
                    {form.values.type === "region"
                      ? "Toàn bộ vùng"
                      : form.values.type === "area"
                      ? "Theo khu vực"
                      : "Theo lô"}
                  </Text>
                  {form.values.managers.length > 0 && (
                    <Text size="sm">
                      <strong>Nhân viên quản lý:</strong>{" "}
                      {form.values.managers.join(", ")}
                    </Text>
                  )}
                  <Text size="sm">
                    <strong>Ghi chú:</strong> {form.values.note || "Không có"}
                  </Text>
                </Stack>
              </Card>

              {/* Giấy chứng nhận (Giữ UI cũ, logic có thể bind sau) */}
              <Card withBorder radius={4} shadow="sm" p="md" h={300}>
                <Title order={5} mb="xs">
                  🏅 Giấy chứng nhận
                </Title>

                <Group align="flex-start" gap="lg" wrap="nowrap">
                  {/* Ảnh chứng nhận + dấu mộc */}
                  <Tooltip label="Dấu chứng nhận VietGAP" withArrow>
                    <Image
                      w={"40%"}
                      src={selectedCertificates?.[0]?.orgLogo}
                      radius="xl"
                      style={{}}
                    />
                  </Tooltip>

                  {/* Nội dung chi tiết */}
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Group justify="space-between">
                      <Group gap={8}>
                        <IconCertificate size={18} />
                        <Title order={5} lh={1.2}>
                          {selectedCertificates?.[0]?.orgName}
                        </Title>
                      </Group>
                      <Badge
                        color="teal"
                        variant="light"
                        leftSection={<IconShieldCheck size={14} />}
                      >
                        Hiệu lực {selectedCertificates?.[0]?.validYears} năm
                      </Badge>
                    </Group>

                    <Group gap="xs" wrap="wrap">
                      <Badge variant="light">
                        {selectedCertificates?.[0]?.certCode}
                      </Badge>
                      <Badge variant="outline">
                        {selectedCertificates?.[0]?.certName}
                      </Badge>
                      <Badge
                        variant="outline"
                        leftSection={<IconCalendar size={14} />}
                      >
                        Cấp ngày {selectedCertificates?.[0]?.issueDate}
                      </Badge>
                    </Group>

                    <Divider my={4} />

                    <Stack gap={4}>
                      <InfoRow
                        label="Tên chứng nhận"
                        value="Chứng nhận VietGAP"
                      />
                      <InfoRow
                        label="Mã số"
                        value={selectedCertificates?.[0]?.certCode}
                      />
                      <InfoRow
                        label="Tổ chức cấp"
                        value={selectedCertificates?.[0]?.certName}
                      />
                      <InfoRow
                        label="Ngày cấp"
                        value={selectedCertificates?.[0]?.createdAt}
                      />
                      <InfoRow
                        label="Thời hạn hiệu lực"
                        value={`${selectedCertificates?.[0]?.validYears} năm`}
                      />
                    </Stack>
                  </Stack>
                </Group>
              </Card>
            </Group>

            {/* Danh sách chi tiết canh tác đã cấu hình */}
            <Card withBorder radius={4} shadow="sm" p="md">
              <Title order={5} mb="xs">
                🌱 Chi tiết canh tác
              </Title>
              <Stack gap="md">
                {Object.values(form.values.cultivationDetails).map((detail) => (
                  <Card key={detail.id} withBorder bg="gray.0" p="sm">
                    <Group justify="space-between" mb="xs">
                      <Text fw={600}>
                        {detail.name}{" "}
                        <Text span c="dimmed" size="xs">
                          ({detail.id})
                        </Text>
                      </Text>
                      <Badge color="blue" variant="light">
                        {detail.farmingMethod}
                      </Badge>
                    </Group>
                    <Text size="sm" mb="xs">
                      Phương pháp tưới: {detail.irrigationMethod || "Chưa chọn"}
                    </Text>

                    {detail.selectedSeeds.length > 0 ? (
                      <Group gap="xs">
                        {detail.selectedSeeds.map((seed, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            color="green"
                            size="lg"
                            leftSection="🍃"
                          >
                            {seed.name}
                          </Badge>
                        ))}
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed" fs="italic">
                        Chưa có cây trồng nào
                      </Text>
                    )}
                  </Card>
                ))}
              </Stack>
            </Card>
          </Stack>
        )}

        {/* --- NAVIGATION BUTTONS --- */}
        {active < 3 && (
          <Group mt="xl" justify="space-between">
            <Button
              radius={4}
              onClick={handlePrevStep}
              disabled={active === 0}
              variant="default"
            >
              Quay lại
            </Button>
            {active < 2 ? (
              <Button radius={4} onClick={handleNextStep}>
                Tiếp theo
              </Button>
            ) : (
              <Button onClick={handleSubmit} radius={4} color="green">
                Lưu
              </Button>
            )}
          </Group>
        )}
      </form>

      {/* --- MODALS --- */}

      {/* Modal chọn Lô (Plot) */}
      <Modal
        opened={openedLotModal}
        onClose={toggleLotModal}
        title={
          <Text fw={"500"} fz={16}>
            Chọn danh sách lô
          </Text>
        }
        size="lg"
      >
        <Stack>
          <Group>
            <Checkbox
              label="Chọn tất cả"
              radius={4}
              onChange={(e) => {
                if (e.currentTarget.checked) {
                  form.setFieldValue(
                    "selectedPlotCodes",
                    availablePlots.map((p) => p.plot.code)
                  );
                } else {
                  form.setFieldValue("selectedPlotCodes", []);
                }
              }}
            />
          </Group>
          <SimpleGrid cols={2} spacing="md">
            {availablePlots.map((lot) => (
              <LotCard
                key={lot.plot.code}
                lotCode={lot.plot.code}
                lotName={lot.plot.name}
                area={lot.plot.area}
                isCheckbox={true}
                elevationInfo={lot.plot.elevation.toString()}
                selected={form.values.selectedPlotCodes.includes(lot.plot.code)}
                onToggle={() => {
                  const code = lot.plot.code;
                  const current = form.values.selectedPlotCodes;
                  const next = current.includes(code)
                    ? current.filter((c) => c !== code)
                    : [...current, code];
                  form.setFieldValue("selectedPlotCodes", next);
                }}
              />
            ))}
          </SimpleGrid>
          <Group justify="flex-end">
            <Button radius={4} onClick={toggleLotModal}>
              Xác nhận
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal Filter Employee */}
      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        size={"lg"}
        title={<Text fw={"bold"}>Lọc nhân sự</Text>}
      >
        <Stack gap={"xs"}>
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" mb={"xs"} label="Đội nhóm" />
            <Radio value="dept" label="Phòng ban và vai trò" />
          </Radio.Group>
          {/* Logic filter UI giữ nguyên */}
          {mode === "group" && (
            <MultiSelect
              label="Đội nhóm"
              radius={4}
              data={["Nhóm Canh tác", "Nhóm Vật tư"]}
            />
          )}
          {mode === "dept" && (
            <>
              <MultiSelect
                label="Phòng ban"
                radius={4}
                data={departments.map((item) => item.name)}
              />
              <MultiSelect
                label="Vai trò"
                radius={4}
                data={positions.map((item) => item.name)}
              />
            </>
          )}
          <EmployeeCardList
            isMultiple
            onChange={(selectedIds) => {
              form.setFieldValue("managers", selectedIds);
            }}
          />
        </Stack>
        <Group mt="md" justify="flex-end">
          <Button
            radius={4}
            variant="outline"
            color="red"
            onClick={closeFilterEmployee}
          >
            Huỷ
          </Button>
          <Button radius={4} onClick={closeFilterEmployee}>
            Xác nhận
          </Button>
        </Group>
      </Modal>

      {/* Modal Filter Tree/Seed */}
      <Modal
        opened={openedFilterTree}
        onClose={() => {
          setOpenedFilterTree(false);
          setOpenedFilterMultiple(false);
          setCurrentEditingEntityId(null);
        }}
        title={
          <Text fw={"500"} fz={16}>
            Tìm kiếm giống cây trồng
          </Text>
        }
        size="xl"
      >
        <Stack gap={"xs"}>
          <Text size="sm" c="dimmed">
            Đang thêm cho:{" "}
            {form.values.cultivationDetails[currentEditingEntityId || ""]?.name}
          </Text>
          <Select
            searchable
            clearable
            label="Nhóm cây trồng"
            data={["Cây ăn trái", "Cây lương thực", "Cây công nghiệp"]}
            radius={4}
          />
          <TextInput
            label="Tìm kiếm"
            leftSection={<IconSearch size={18} />}
            radius={4}
            placeholder="Tên giống..."
          />

          <Title order={6} mt="sm">
            Danh sách giống
          </Title>
          <SeedCards
            selected=""
            seeds={seeds} // Lấy từ store
            onSelect={handleSelectSeedForEntity} // Hàm xử lý logic add vào config
            isMultiple={false}
            isTouchable
          />
          <Group justify="flex-end" mt="md">
            <Button radius={4} onClick={() => setOpenedFilterTree(false)}>
              Xác nhận
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
};

export default memo(AreaManagementAddRegionPage);
