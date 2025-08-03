// AddSupplyForm: full version with 4-step wizard form logic for nhập/xuất/hủy

import {
  Button,
  Card,
  Group,
  Select,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  NumberInput,
  Divider,
  Paper,
  Modal,
  Radio,
  MultiSelect,
  Input,
  Badge,
  SegmentedControl,
  Image,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconPlant2,
  IconPlus,
  IconSearch,
  IconSpray,
  IconTools,
  IconTractor,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { SelectableSupplierCards } from "../../../SupplyManagementPage/Add/components/SelectableSupplierCards";
import { SelectableEnterpriseCards } from "../../../StockManagementPage/Delivery/Add/components/SelectableEnterpriseCards";
import { warehouses } from "../../Material/Add";
import { useNavigate } from "react-router-dom";
import Scrollable from "../../../../components/Scrollable";
const machineTypes = [
  {
    id: "MCH01",
    name: "Máy cày Kubota",
    img: "https://kubotadailoi.com/uploads/images/P-1176_L3218_slide.jpg",
  },
  {
    id: "MCH02",
    name: "Máy phun thuốc Honda",
    img: "https://www.ketnoitieudung.vn/data/bt6/may-phun-thuoc-honda-wjr2525t1-gcs-1604389460.jpg",
  },
  {
    id: "MCH03",
    name: "Máy gặt đập liên hợp Yanmar",
    img: "https://dailoi.vn/uploads/images/2021/09/1631365221-single_product1-kubotadc70plusa.jpg",
  },
  {
    id: "MCH04",
    name: "Máy bay nông nghiệp DJI Agras",
    img: "https://agridrone.vn/wp-content/uploads/2023/02/16887_T50_%E6%AD%A3%E4%BE%A7.jpg",
  },
];
const contracts = ["HD-001 - Công ty A", "HD-002 - Công ty B"];
const assetTypes = [
  {
    label: "Máy móc",
    value: "Máy móc",
    icon: <IconTractor size={18} />,
  },
  {
    label: "Thuốc BVTV",
    value: "Thuốc bảo vệ thực vật",
    icon: <IconSpray size={18} />,
  },
  {
    label: "Vật tư",
    value: "Vật tư",
    icon: <IconTools size={18} />,
  },
  {
    label: "Phân bón",
    value: "Phân bón",
    icon: <IconPlant2 size={18} />,
  },
];
const PurchaseManagementProductAddPage = () => {
  const navigate = useNavigate();
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [mode, setMode] = useState("");
  const [segment, setSegment] = useState("Kho");
  const [active, setActive] = useState(0);
  const form = useForm({
    initialValues: {
      type: "nhập",
      createdDate: new Date("2025-07-15"),
      area: "KV1",
      subArea: "KV1-A",
      warehouse: "Kho A",
      handler: "Nguyễn Văn A",
      checker: "Trần Thị B",
      materialCategory: "Phân bón",
      receiptNumber: "PNK-20250715-001",
      invoiceNumber: "HD-789456",
      supplier: "CTY Phân Bón Xanh",
      packaging: "Bao 50kg",
      unit: "bao",
      quantity: 100,
      contract: "HD-001 - Công ty A",
      note: "Sử dụng trong đợt chăm bón tháng 8 cho vùng KV1-A",
    },
    validate: {
      type: (v) => (!v ? "Chọn loại phiếu" : null),
      createdDate: (v) => (!v ? "Chọn ngày thực hiện" : null),
      area: (v) => (!v ? "Khu vực" : null),
      warehouse: (v) => (!v ? "Chọn kho" : null),
      materialCategory: (v) => (!v ? "Chọn phân loại" : null),
      receiptNumber: (v) => (!v ? "Nhập số phiếu" : null),
      quantity: (v) => (v <= 0 ? "Số lượng phải > 0" : null),
    },
  });

  const nextStep = () => setActive((cur) => (cur < 4 ? cur + 1 : cur));
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group mb="md">
        <Button
          variant="subtle"
          onClick={() => history.back()}
          leftSection={<IconArrowLeft size={18} />}
        >
          Quay lại
        </Button>
        <Title order={3}>📦 Tạo phiếu thu mua sản phẩm</Title>
      </Group>

      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
      >
        {/* Step 1 */}
        <Stepper.Step label="Bước 1" description="Thông tin cơ bản">
          <Stack>
            <DatePickerInput
              label="Ngày thực hiện"
              {...form.getInputProps("createdDate")}
              required
              locale="vi"
              radius={4}
            />
            <TextInput
              label="Doanh nghiệp / nông hộ (chọn một)"
              placeholder="Tìm kiếm doanh nghiệp"
              radius={4}
              leftSection={<IconSearch size={18} />}
            />
            <SelectableEnterpriseCards isCheckbox={false} isMulti={false} />

            <Stack>
              <Group>
                <Text fw={"500"} fz={15}>
                  Nhân viên thực hiện
                </Text>
                <Button
                  variant="light"
                  radius={4}
                  onClick={openFilterEmployee}
                  leftSection={<IconUser size={18} />}
                >
                  Chọn người xử lý
                </Button>
              </Group>
              <Group>
                <Text fw={"500"} fz={15}>
                  Người kiểm tra
                </Text>
                <Button
                  variant="light"
                  radius={4}
                  onClick={openFilterEmployee}
                  leftSection={<IconUser size={18} />}
                >
                  Chọn người kiểm tra
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Stepper.Step>

        {/* Step 2 */}
        <Stepper.Step label="Bước 2" description="Thông tin hợp đồng">
          <Stack>
            <Stack gap={"xs"}>
              <TextInput
                leftSection={<IconSearch size={18} />}
                placeholder="Tìm kiếm hợp đồng"
                label="Hợp đồng (chọn một)"
                radius={4}
              />
              <Group>
                <Card shadow="sm" padding="md" radius="md" withBorder>
                  <Group justify="apart" mb="xs">
                    <Title order={5}>
                      HĐMB-001 - Hợp đồng mua bán thiết bị tưới
                    </Title>
                    <Badge color="blue">Hợp đồng mua bán</Badge>
                  </Group>

                  <Text size="sm">
                    <b>Ngày ký:</b> 20/06/2025
                  </Text>
                  <Text size="sm">
                    <b>Bên A:</b> CTY TNHH Thiết bị Nông nghiệp
                  </Text>
                  <Text size="sm">
                    <b>Bên B:</b> Hợp tác xã Rau Sạch Lâm Đồng
                  </Text>
                  <Text size="sm">
                    <b>Loại hợp đồng:</b> Mới
                  </Text>

                  <Divider my="xs" />
                  <Text size="sm" lineClamp={2}>
                    <b>Nội dung:</b> Cung cấp hệ thống tưới tự động và thiết bị
                    điều khiển trung tâm...
                  </Text>

                  <Group mt="md" justify="apart">
                    <Button size="xs" variant="light">
                      Xem chi tiết
                    </Button>
                    <Button size="xs" variant="subtle" color="red">
                      Huỷ
                    </Button>
                  </Group>
                </Card>
                <Card shadow="sm" padding="md" radius="md" withBorder>
                  <Group justify="apart" mb="xs">
                    <Title order={5}>
                      HĐMB-001 - Hợp đồng mua bán thiết bị tưới
                    </Title>
                    <Badge color="blue">Hợp đồng mua bán</Badge>
                  </Group>

                  <Text size="sm">
                    <b>Ngày ký:</b> 20/06/2025
                  </Text>
                  <Text size="sm">
                    <b>Bên A:</b> CTY TNHH Thiết bị Nông nghiệp
                  </Text>
                  <Text size="sm">
                    <b>Bên B:</b> Hợp tác xã Rau Sạch Lâm Đồng
                  </Text>
                  <Text size="sm">
                    <b>Loại hợp đồng:</b> Mới
                  </Text>

                  <Divider my="xs" />
                  <Text size="sm" lineClamp={2}>
                    <b>Nội dung:</b> Cung cấp hệ thống tưới tự động và thiết bị
                    điều khiển trung tâm...
                  </Text>

                  <Group mt="md" justify="apart">
                    <Button size="xs" variant="light">
                      Xem chi tiết
                    </Button>
                    <Button size="xs" variant="subtle" color="red">
                      Huỷ
                    </Button>
                  </Group>
                </Card>
              </Group>
            </Stack>

            <SegmentedControl
              orientation="horizontal"
              data={["Kho", "Mua bán"]}
              radius={4}
              onChange={setSegment}
            />
            {segment === "Kho" && (
              <Stack gap={"xs"}>
                <Text fw={500} fz={15}>
                  Kho (chọn một)
                </Text>
                <Stack>
                  <Group>
                    {warehouses.map((group, index) => (
                      <Card
                        key={group.id}
                        withBorder
                        radius="md"
                        shadow="sm"
                        p="md"
                        style={{
                          borderColor: index === 0 ? "green" : undefined,
                        }}
                      >
                        <Title order={5} mb="xs">
                          🏬 Kho lưu trữ
                        </Title>
                        <Stack gap="xs">
                          <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                              Tên kho:
                            </Text>
                            <Text fw={500}>{group.warehouseName}</Text>
                          </Group>
                          <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                              Khu vực đã chọn:
                            </Text>
                            <Text fw={500}>{group.areaGroup}</Text>
                          </Group>
                          <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                              Mã khu phụ:
                            </Text>
                            <Text fw={500}>{group.name}</Text>
                          </Group>
                        </Stack>
                      </Card>
                    ))}
                  </Group>
                </Stack>
              </Stack>
            )}
            {segment === "Mua bán" && (
              <Stack gap={"xs"}>
                <TextInput
                  radius={4}
                  placeholder="Chọn nhà cung cấp"
                  label="Danh sách nhà cung cấp (Chọn nhiều)"
                  leftSection={<IconSearch size={18} />}
                />
                <SelectableSupplierCards isCheckbox={true} />
              </Stack>
            )}
            <Divider label="Danh sách tài sản" />
            <Card radius={4} withBorder>
              <Stack>
                <Input.Wrapper label="Loại tài sản">
                  <Group gap="sm" wrap="wrap">
                    {assetTypes.map((type, index) => (
                      <Button
                        key={type.value}
                        leftSection={type.icon}
                        radius={4}
                        variant={index === 0 ? "filled" : "outline"}
                      >
                        {type.label}
                      </Button>
                    ))}
                  </Group>
                </Input.Wrapper>
                <Select
                  radius={4}
                  label="Danh mục máy móc thiết bị"
                  placeholder="Tìm kiếm danh mục máy móc thiết bị"
                  leftSection={<IconTruck size={18} />}
                  data={[
                    { value: "MCH01", label: "Máy cày Kubota" },
                    { value: "MCH02", label: "Máy phun thuốc Honda" },
                    {
                      value: "MCH03",
                      label: "Máy gặt đập liên hợp Yanmar",
                    },
                    {
                      value: "MCH04",
                      label: "Máy bay nông nghiệp DJI Agras",
                    },
                    {
                      value: "MCH05",
                      label: "Máy bơm nước Honda WB20XT",
                    },
                    { value: "MCH06", label: "Máy trộn bê tông 250L" },
                  ]}
                />
                <TextInput
                  label="Máy móc thiết bị"
                  placeholder="Tìm kiếm máy móc thiết bị"
                  radius={4}
                  leftSection={<IconSearch size={18} />}
                />
                <Scrollable h={130}>
                  <Group gap="md" wrap="nowrap">
                    {machineTypes.map((machine, index) => (
                      <Card
                        key={index}
                        withBorder
                        miw={300}
                        shadow="sm"
                        radius="md"
                        p="md"
                      >
                        <Group grow>
                          <Image
                            src={
                              machine.img || "https://via.placeholder.com/150" // Placeholder nếu không có hình ảnh
                            }
                            alt={machine.name}
                            w={100}
                            h={100}
                            radius="md"
                          />
                          <Stack>
                            <Text fw={500} size="lg">
                              {machine.name}
                            </Text>
                            <Text size="sm" color="dimmed">
                              Mã: {machine.id}
                            </Text>
                          </Stack>
                        </Group>
                      </Card>
                    ))}
                  </Group>
                </Scrollable>
                <Group grow>
                  <NumberInput
                    label="Số lượng"
                    min={1}
                    hideControls
                    {...form.getInputProps("quantity")}
                    radius={4}
                  />
                  <MultiSelect
                    label="Quy cách"
                    radius={4}
                    placeholder="Quy cách"
                    data={[
                      {
                        value: "PKG001",
                        label: "Hộp giấy nhỏ (50 cái)",
                      },
                      {
                        value: "PKG002",
                        label: "Túi nilon lớn (100 cái)",
                      },
                      {
                        value: "PKG003",
                        label: "Bao tải 25kg (25 cái)",
                      },
                      {
                        value: "PKG004",
                        label: "Bịch nhựa 1kg (10 cái)",
                      },
                      {
                        value: "PKG005",
                        label: "Thùng carton lớn (20 cái)",
                      },
                      {
                        value: "PKG006",
                        label: "Hộp nhựa 500ml (30 cái)",
                      },
                    ]}
                  />
                </Group>
              </Stack>
            </Card>
            <Button radius={4} variant="light" leftSection={<IconPlus />}>
              Thêm mới
            </Button>
          </Stack>
        </Stepper.Step>

        {/* Step 3 */}
        <Stepper.Step label="Bước 3" description="Thông tin hợp đồng">
          <Stack>
            {form.values.type === "nhập" || form.values.type === "xuất" ? (
              <Stack>
                <Select
                  label="Chọn hợp đồng liên quan"
                  data={contracts}
                  searchable
                  placeholder="(Tuỳ chọn)"
                  {...form.getInputProps("contract")}
                  radius={4}
                />
                <Scrollable h={220}>
                  <Group>
                    <Card shadow="sm" padding="md" radius="md" withBorder>
                      <Group justify="apart" mb="xs">
                        <Title order={5}>
                          HĐMB-001 - Hợp đồng mua bán thiết bị tưới
                        </Title>
                        <Badge color="blue">Hợp đồng mua bán</Badge>
                      </Group>

                      <Text size="sm">
                        <b>Ngày ký:</b> 20/06/2025
                      </Text>
                      <Text size="sm">
                        <b>Bên A:</b> CTY TNHH Thiết bị Nông nghiệp
                      </Text>
                      <Text size="sm">
                        <b>Bên B:</b> Hợp tác xã Rau Sạch Lâm Đồng
                      </Text>
                      <Text size="sm">
                        <b>Loại hợp đồng:</b> Mới
                      </Text>

                      <Divider my="xs" />
                      <Text size="sm" lineClamp={2}>
                        <b>Nội dung:</b> Cung cấp hệ thống tưới tự động và thiết
                        bị điều khiển trung tâm...
                      </Text>

                      <Group mt="md" justify="apart">
                        <Button size="xs" variant="light">
                          Xem chi tiết
                        </Button>
                        <Button size="xs" variant="subtle" color="red">
                          Huỷ
                        </Button>
                      </Group>
                    </Card>
                    <Card shadow="sm" padding="md" radius="md" withBorder>
                      <Group justify="apart" mb="xs">
                        <Title order={5}>
                          HĐMB-001 - Hợp đồng mua bán thiết bị tưới
                        </Title>
                        <Badge color="blue">Hợp đồng mua bán</Badge>
                      </Group>

                      <Text size="sm">
                        <b>Ngày ký:</b> 20/06/2025
                      </Text>
                      <Text size="sm">
                        <b>Bên A:</b> CTY TNHH Thiết bị Nông nghiệp
                      </Text>
                      <Text size="sm">
                        <b>Bên B:</b> Hợp tác xã Rau Sạch Lâm Đồng
                      </Text>
                      <Text size="sm">
                        <b>Loại hợp đồng:</b> Mới
                      </Text>

                      <Divider my="xs" />
                      <Text size="sm" lineClamp={2}>
                        <b>Nội dung:</b> Cung cấp hệ thống tưới tự động và thiết
                        bị điều khiển trung tâm...
                      </Text>

                      <Group mt="md" justify="apart">
                        <Button size="xs" variant="light">
                          Xem chi tiết
                        </Button>
                        <Button size="xs" variant="subtle" color="red">
                          Huỷ
                        </Button>
                      </Group>
                    </Card>
                  </Group>
                </Scrollable>
              </Stack>
            ) : (
              <Text>
                Không áp dụng hợp đồng cho phiếu loại "{form.values.type}".
              </Text>
            )}
          </Stack>
        </Stepper.Step>

        {/* Step 4 */}
        <Stepper.Step label="Bước 4" description="Xác nhận thông tin">
          <Paper withBorder radius="md" p="md">
            <Stack gap="md">
              <Group justify="apart">
                <Title order={5}>📋 Thông tin tổng quan</Title>
                <Badge color="blue" variant="light">
                  Phiếu: {form.values.type?.toUpperCase()}
                </Badge>
              </Group>
              <Divider />
              <Group grow>
                <Stack gap={2}>
                  <Text size="sm">
                    <b>Ngày:</b> {form.values.createdDate.toLocaleDateString()}
                  </Text>
                  <Text size="sm">
                    <b>Khu vực:</b> {form.values.area}
                  </Text>
                  {form.values.subArea && (
                    <Text size="sm">
                      <b>Khu phụ:</b> {form.values.subArea}
                    </Text>
                  )}
                  <Text size="sm">
                    <b>Kho:</b> {form.values.warehouse}
                  </Text>
                </Stack>
                <Stack gap={2}>
                  <Text size="sm">
                    <b>Người xử lý:</b> {form.values.handler}
                  </Text>
                  <Text size="sm">
                    <b>Người kiểm tra:</b> {form.values.checker}
                  </Text>
                </Stack>
              </Group>

              <Divider label="Chi tiết vật tư" labelPosition="center" />
              <Group grow>
                <Stack gap={2}>
                  <Text size="sm">
                    <b>Phân loại:</b> {form.values.materialCategory}
                  </Text>
                  <Text size="sm">
                    <b>Số phiếu:</b> {form.values.receiptNumber}
                  </Text>
                  {form.values.invoiceNumber && (
                    <Text size="sm">
                      <b>Hóa đơn:</b> {form.values.invoiceNumber}
                    </Text>
                  )}
                  {form.values.supplier && (
                    <Text size="sm">
                      <b>Nhà cung cấp:</b> {form.values.supplier}
                    </Text>
                  )}
                </Stack>
                <Stack gap={2}>
                  <Text size="sm">
                    <b>Số lượng:</b> {form.values.quantity}
                  </Text>
                  <Text size="sm">
                    <b>Quy cách:</b> {form.values.unit}
                  </Text>
                  {form.values.packaging && (
                    <Text size="sm">
                      <b>Quy cách:</b> {form.values.packaging}
                    </Text>
                  )}
                </Stack>
              </Group>

              {form.values.contract && (
                <>
                  <Divider label="Thông tin hợp đồng" labelPosition="center" />
                  <Text size="sm">🔗 {form.values.contract}</Text>
                </>
              )}

              {form.values.note && (
                <>
                  <Divider label="Ghi chú" labelPosition="center" />
                  <Text size="sm">📝 {form.values.note}</Text>
                </>
              )}
            </Stack>
          </Paper>
        </Stepper.Step>

        <Stepper.Completed>
          <Stack align="center" justify="center" mt="xl">
            <Image
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPNbBpZeXnXfTuA6AWek-Kj8NYEVbYdG6ayi5bIWarDuryXDrILdKMTd597quLD0PBKM&usqp=CAU"
              }
              w={200}
              fit="cover"
            />
            <Text fz={"h2"} ta="center">
              Thêm mới sản phẩm thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Sản phẩm mới đã được thêm thành công. Bạn có thể xem lại thông tin
              chi tiết trong danh sách sản phẩm.
            </Text>

            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      {active < 4 && (
        <Group mt="xl" justify="space-between">
          <Button
            radius={4}
            variant="default"
            onClick={prevStep}
            disabled={active === 0}
          >
            Quay lại
          </Button>
          {active < 3 && (
            <Button radius={4} onClick={nextStep}>
              Tiếp theo
            </Button>
          )}
          {active === 3 && (
            <Button radius={4} color="green" onClick={nextStep}>
              Hoàn thành
            </Button>
          )}
        </Group>
      )}
      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        title={<Text fw={"bold"}>Lọc nhân sự</Text>}
      >
        <Stack gap={"xs"}>
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" mb={"xs"} label="Chọn theo đội nhóm" />
            <Radio value="dept" label="Chọn theo phòng ban và vai trò" />
          </Radio.Group>

          {mode === "group" && (
            <MultiSelect
              label="Chọn đội nhóm"
              radius={4}
              data={["Nhóm Canh tác", "Nhóm Vật tư"]}
            />
          )}

          {mode === "dept" && (
            <>
              <TextInput
                label="Phòng ban"
                placeholder="Tìm kiếm phòng ban liên quan"
                leftSection={<IconSearch size={16} />}
                radius={4}
              />
              <DepartmentCardList />
              <MultiSelect
                label="Chọn vai trò"
                radius={4}
                data={["Giám đốc", "Tổ trưởng", "Trưởng phòng"]}
              />
            </>
          )}
          <TextInput
            label="Tìm kiếm nhân viên"
            placeholder="Chọn thành viên từ nhân sự"
            leftSection={<IconSearch size={16} />}
            radius={4}
          />
          <EmployeeCardList />
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
          <Button radius={4}>Xác nhận</Button>
        </Group>
      </Modal>
    </Card>
  );
};

export default PurchaseManagementProductAddPage;
