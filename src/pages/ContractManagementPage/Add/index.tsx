// ContractManagementAddPage – rewritten with full 5-step logic based on user request

import {
  Button,
  Card,
  Group,
  NumberInput,
  Radio,
  Select,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  Divider,
  Paper,
  Input,
  SegmentedControl,
  ScrollArea,
  Image,
  Badge,
  MultiSelect,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconArrowLeft,
  IconPhoto,
  IconPlant2,
  IconSearch,
  IconSettings,
  IconSpray,
  IconTools,
  IconTruck,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectableEnterpriseCards } from "../../StockManagementPage/Delivery/Add/components/SelectableEnterpriseCards";
import { Dropzone } from "@mantine/dropzone";
import SunEditor from "suneditor-react";
import Scrollable from "../../../components/Scrollable";
import { machineTypes } from "../../PurchaseManagementPage/Material/Add";
const itemTypes = [
  {
    label: "Máy móc thiết bị",
    value: "Máy móc thiết bị",
    icon: <IconSettings size={18} />,
  },
  { label: "Thuốc", value: "Thuốc", icon: <IconSpray size={18} /> },
  { label: "Phân", value: "Phân", icon: <IconPlant2 size={18} /> },
  { label: "Vật tư", value: "Vật tư", icon: <IconTools size={18} /> },
];
const contractTypes = [
  "Hợp đồng mua bán",
  "Hợp đồng trao đổi",
  "Hợp đồng cho tặng",
  "Hợp đồng vay",
  "Hợp đồng thuê",
  "Hợp đồng mượn",
  "Hợp đồng dịch vụ",
  "Hợp đồng vận chuyển",
  "Hợp đồng gia công",
  "Hợp đồng gửi giữ tài sản",
  "Hợp đồng ủy quyền",
  "Hợp đồng hợp tác",
];

const ContractManagementAddPage = () => {
  const [presentType, setPresentType] = useState("Tổng quan");
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedMachine, setSelectedMachine] = useState<string>();
  const [form, setForm] = useState({
    code: "HD-2025-001",
    name: "Hợp đồng mua máy cày Kubota",
    signDate: new Date("2025-07-01"),
    type: "Hợp đồng mua bán",
    isAppendix: "Hợp đồng mới",
    mode: "Chi tiết",
    items: [
      {
        type: "Phân",
        category: "Phân vô cơ",
        name: "Phân NPK",
        quantity: 500,
        unit: "Kg",
        spec: "NPK 16-16-8",
        img: "https://nongnghiepbenvung.vn/ckfinder/userfiles/images/cac-loai-phan-npk.jpg",
      },
      {
        type: "Phân",
        category: "Phân vô cơ",
        name: "Phân Urê",
        quantity: 300,
        unit: "Kg",
        spec: "Đạm 46%",
        img: "https://nongnghiepbenvung.vn/ckfinder/userfiles/images/phan-dam-la-gi.jpg",
      },
      {
        type: "Phân",
        category: "Phân vô cơ",
        name: "Phân Kali",
        quantity: 200,
        unit: "Kg",
        spec: "Kali Clorua 60%",
        img: "https://glawvn.com/wp-content/uploads/2023/04/phan-kali-la-gi-ky-thuat-bon-de-dat-hieu-qua-cao.jpeg",
      },
      {
        type: "Phân",
        category: "Phân vô cơ",
        name: "Phân DAP",
        quantity: 400,
        unit: "Kg",
        spec: "DAP 18-46-0",
        img: "https://nongnghiepbenvung.vn/ckfinder/userfiles/images/cac-loai-phan-npk.jpg",
      },
      {
        type: "Phân",
        category: "Phân hữu cơ",
        name: "Phân hữu cơ",
        quantity: 1000,
        unit: "Kg",
        spec: "Phân hữu cơ vi sinh",
        img: "https://agriplusvn.com/wp-content/uploads/2020/06/phan-huu-co1-scaled-1.jpg",
      },
    ],
    items_vehicle: [
      {
        type: "Máy móc thiết bị",
        category: "Máy nông nghiệp",
        name: "Máy cày Kubota",
        quantity: 2,
        unit: "Cái",
        spec: "Kubota L5018",
        img: "https://kubotadailoi.com/uploads/images/P-1176_L3218_slide.jpg",
      },
      {
        type: "Máy móc thiết bị",
        category: "Máy nông nghiệp",
        name: "Máy gặt đập liên hợp",
        quantity: 1,
        unit: "Cái",
        spec: "Yanmar AW82V",
        img: "https://dailoi.vn/uploads/images/2021/09/1631365221-single_product1-kubotadc70plusa.jpg",
      },
      {
        type: "Máy móc thiết bị",
        category: "Máy công nghiệp",
        name: "Máy bơm nước",
        quantity: 5,
        unit: "Cái",
        spec: "Honda WB20XT",
        img: "https://cdn.tgdd.vn/Products/Images/7604/282359/may-bom-nuoc-ly-tam-ingco-mhf15001-1-700x467.jpg",
      },
      {
        type: "Máy móc thiết bị",
        category: "Máy xây dựng",
        name: "Máy trộn bê tông",
        quantity: 1,
        unit: "Cái",
        spec: "Trộn 250L",
        img: "https://dienmaythanhloi.vn/uploads/maytronbetong250lit.jpg",
      },
    ],
    partyA: "Doanh nghiệp",
    partyB: "Nông hộ",
    docType: "file",
    summary:
      "Cung cấp thiết bị canh tác và phân bón cho dự án cải tạo đất năm 2025",
    file: null,
  });

  const addItem = () => {};

  return (
    <Card withBorder radius={4} p="lg">
      <Stack>
        <Group mb="md">
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>📄 Tạo mới hợp đồng</Title>
        </Group>

        <Stepper active={activeStep} onStepClick={setActiveStep} size="sm">
          {/* Step 1 */}
          <Stepper.Step label="Bước 1" description="Thông tin cơ bản">
            <Stack>
              <TextInput
                label="Mã hợp đồng"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                radius={4}
              />
              <TextInput
                label="Tên hợp đồng"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                radius={4}
              />
              <DatePickerInput
                label="Ngày ký kết"
                value={form.signDate}
                locale="vi"
                onChange={(val) => setForm({ ...form, signDate: val })}
                radius={4}
              />
              <Select
                label="Loại hợp đồng"
                data={contractTypes}
                value={form.type}
                onChange={(val) => setForm({ ...form, type: val })}
                radius={4}
              />
            </Stack>
          </Stepper.Step>

          {/* Step 2 */}
          <Stepper.Step label="Bước 2" description="Nội dung liên quan">
            <Stack>
              <Radio.Group
                label="Loại hợp đồng"
                value={form.isAppendix}
                onChange={(val) => setForm({ ...form, isAppendix: val })}
              >
                <Stack gap={"xs"}>
                  <Radio value="Hợp đồng mới" label="Hợp đồng mới" />
                  <Radio value="Phụ lục" label="Phụ lục hợp đồng" />
                </Stack>
              </Radio.Group>
              {form.isAppendix === "Phụ lục" && (
                <Stack gap={"xs"}>
                  <TextInput
                    leftSection={<IconSearch size={18} />}
                    placeholder="Tìm kiếm hợp đồng"
                    label="Hợp đồng - Phụ lục"
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
                </Stack>
              )}
              <Dropzone
                onDrop={(files) => console.log("accepted files", files)}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={5 * 1024 ** 2}
                accept={["application/pdf"]}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={220}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconUpload
                      size={52}
                      color="var(--mantine-color-blue-6)"
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      size={52}
                      color="var(--mantine-color-red-6)"
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto
                      size={52}
                      color="var(--mantine-color-dimmed)"
                      stroke={1.5}
                    />
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline>
                      Bỏ và thả hợp đồng tại đây
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Đính kèm hợp đồng (tối đa 5MB)
                    </Text>
                  </div>
                </Group>
              </Dropzone>
              <Radio.Group
                label="Nội dung hợp đồng"
                value={form.docType}
                onChange={(val) => setForm({ ...form, docType: val })}
              >
                <Group mt="xs">
                  <Radio value="file" label="Tải file PDF" />
                  <Radio value="editor" label="Nội dung hợp đồng" />
                </Group>
              </Radio.Group>

              {form.docType === "file" ? (
                <Dropzone
                  onDrop={(files) => console.log("accepted files", files)}
                  onReject={(files) => console.log("rejected files", files)}
                  maxSize={5 * 1024 ** 2}
                  accept={["application/pdf"]}
                >
                  <Group
                    justify="center"
                    gap="xl"
                    mih={220}
                    style={{ pointerEvents: "none" }}
                  >
                    <Dropzone.Accept>
                      <IconUpload
                        size={52}
                        color="var(--mantine-color-blue-6)"
                        stroke={1.5}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        size={52}
                        color="var(--mantine-color-red-6)"
                        stroke={1.5}
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconPhoto
                        size={52}
                        color="var(--mantine-color-dimmed)"
                        stroke={1.5}
                      />
                    </Dropzone.Idle>

                    <div>
                      <Text size="xl" inline>
                        Bỏ và thả nội dung hợp đồng tại đây
                      </Text>
                      <Text size="sm" c="dimmed" inline mt={7}>
                        Đính kèm nội dung hợp đồng (tối đa 5MB)
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              ) : (
                <div>
                  <label style={{ fontSize: 14, fontWeight: 500 }}>
                    Nội dung hợp đồng
                  </label>
                  <SunEditor
                    setOptions={{
                      height: "200px",
                      buttonList: [
                        ["undo", "redo"],
                        ["font", "fontSize", "formatBlock"],
                        ["paragraphStyle", "blockquote"],
                        [
                          "bold",
                          "underline",
                          "italic",
                          "strike",
                          "subscript",
                          "superscript",
                        ],
                        ["fontColor", "hiliteColor", "textStyle"],
                        ["removeFormat"],
                        "/", // Line break
                        ["outdent", "indent"],
                        ["align", "horizontalRule", "list", "lineHeight"],
                        [
                          "table",
                          "link",
                          "image",
                          "video",
                          "audio" /** ,'math' */,
                        ], // You must add the 'katex' library at options to use the 'math' plugin.
                        /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
                        ["fullScreen", "showBlocks", "codeView"],
                        ["preview", "print"],
                        ["save", "template"],
                        /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
                      ],
                    }}
                  />
                </div>
              )}
              <SegmentedControl
                value={presentType}
                onChange={setPresentType}
                data={["Tổng quan", "Chi tiết"]}
                radius={4}
              />
              {presentType === "Chi tiết" && (
                <Stack gap={"xs"}>
                  {form.items.map((item, index) => (
                    <Card withBorder radius={4} key={index} p="md">
                      <Stack gap={"xs"}>
                        <Input.Wrapper label="Hàng hoá">
                          <Group gap="xs" wrap="wrap">
                            {itemTypes.map((item, index) => (
                              <Button
                                key={item.value}
                                radius={4}
                                p="xs"
                                variant={index === 0 ? "filled" : "outline"}
                              >
                                <Group>
                                  {item.icon}
                                  <Text size="sm" fw={500}>
                                    {item.label}
                                  </Text>
                                </Group>
                              </Button>
                            ))}
                          </Group>
                        </Input.Wrapper>
                        <Select
                          radius={4}
                          label="Loại máy móc thiết bị"
                          placeholder="Tìm kiếm loại máy móc thiết bị"
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
                          label="Máy móc thiết bị (chọn một)"
                          placeholder="Tìm kiếm máy móc thiết bị"
                          radius={4}
                          leftSection={<IconSearch size={18} />}
                        />
                        <Scrollable h={160}>
                          <Group gap="md" p={"xs"} wrap="nowrap">
                            {machineTypes.map((machine, index) => (
                              <Card
                                key={index}
                                withBorder
                                miw={300}
                                h={150}
                                shadow="sm"
                                radius="md"
                                p="md"
                                style={{
                                  position: "relative",
                                  transition: "transform 0.2s ease",
                                  borderColor:
                                    selectedMachine === machine.id
                                      ? "green"
                                      : undefined,
                                  cursor: "pointer",
                                }}
                                onClick={() => setSelectedMachine(machine.id)}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.transform =
                                    "scale(1.02)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.transform = "scale(1)")
                                }
                              >
                                <Group grow>
                                  <Image
                                    src={
                                      machine?.img ||
                                      "https://via.placeholder.com/150" // Placeholder nếu không có hình ảnh
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
                        <Group grow key={index} align="flex-end">
                          <NumberInput
                            label="Số lượng"
                            value={item.quantity}
                            radius={4}
                          />
                          {/* <Select
                            label="Đơn vị"
                            data={units}
                            value={item.unit}
                            radius={4}
                          /> */}
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
                  ))}
                  <Button variant="light" onClick={addItem} radius={4} mt="xs">
                    + Thêm hàng hoá
                  </Button>
                </Stack>
              )}
              {presentType === "Tổng quan" && (
                <Stack gap={"xs"}>
                  {form.items.map((item, index) => (
                    <Card withBorder radius={4} key={index} p="md">
                      <Stack gap={"xs"}>
                        <Input.Wrapper label="Hàng hoá">
                          <Group gap="xs" wrap="wrap">
                            {itemTypes.map((item, index) => (
                              <Button
                                key={item.value}
                                radius={4}
                                p="xs"
                                variant={index === 0 ? "filled" : "outline"}
                              >
                                <Group>
                                  {item.icon}
                                  <Text size="sm" fw={500}>
                                    {item.label}
                                  </Text>
                                </Group>
                              </Button>
                            ))}
                          </Group>
                        </Input.Wrapper>
                        <Select
                          radius={4}
                          label="Loại máy móc thiết bị"
                          placeholder="Tìm kiếm loại máy móc thiết bị"
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
                          label="Máy móc thiết bị (chọn một)"
                          placeholder="Tìm kiếm máy móc thiết bị"
                          radius={4}
                          leftSection={<IconSearch size={18} />}
                        />
                        <Scrollable h={160}>
                          <Group gap="md" p={"xs"} wrap="nowrap">
                            {machineTypes.map((machine, index) => (
                              <Card
                                key={index}
                                withBorder
                                miw={300}
                                h={150}
                                shadow="sm"
                                radius="md"
                                p="md"
                                style={{
                                  position: "relative",
                                  transition: "transform 0.2s ease",
                                  borderColor:
                                    selectedMachine === machine.id
                                      ? "green"
                                      : undefined,
                                  cursor: "pointer",
                                }}
                                onClick={() => setSelectedMachine(machine.id)}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.transform =
                                    "scale(1.02)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.transform = "scale(1)")
                                }
                              >
                                <Group grow>
                                  <Image
                                    src={
                                      machine.img ||
                                      "https://via.placeholder.com/150" // Placeholder nếu không có hình ảnh
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
                      </Stack>
                    </Card>
                  ))}
                  <Button variant="light" onClick={addItem} radius={4} mt="xs">
                    + Thêm hàng hoá
                  </Button>
                </Stack>
              )}
            </Stack>
          </Stepper.Step>

          {/* Step 3 */}
          <Stepper.Step label="Bước 3" description="Thông tin bên A">
            <Stack gap={"xs"}>
              <Title order={4}>Thông tin bên A</Title>
              <TextInput
                label="Chọn doanh nghiệp / nông hộ (chọn một)"
                placeholder="Tìm kiếm doanh nghiệp"
                radius={4}
                leftSection={<IconSearch size={18} />}
              />
              <SelectableEnterpriseCards isMulti={false} isCheckbox={false} />
            </Stack>
          </Stepper.Step>

          {/* Step 4 */}
          <Stepper.Step label="Bước 4" description="Thông tin bên B">
            <Stack gap={"xs"}>
              <Title order={4}>Thông tin bên B</Title>
              <TextInput
                label="Chọn doanh nghiệp / nông hộ (chọn một)"
                placeholder="Tìm kiếm doanh nghiệp"
                radius={4}
                leftSection={<IconSearch size={18} />}
              />
              <SelectableEnterpriseCards isCheckbox={false} isMulti={false} />
            </Stack>
          </Stepper.Step>

          {/* Step 5 */}
          <Stepper.Step label="Bước 5" description="Xác nhận">
            <Paper withBorder radius={4} p="md">
              <Stack>
                <Title order={5}>📌 Thông tin hợp đồng</Title>
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
                  <b>Kiểu:</b> {form.isAppendix}
                </Text>
                <Text>
                  <b>Trình bày:</b> {form.mode}
                </Text>

                <Divider
                  label="Danh sách hàng hoá"
                  labelPosition="center"
                  my="xs"
                />
                <Card withBorder radius={4} p="md">
                  <Stack>
                    <Group>
                      <IconPlant2 size={18} />
                      <Title order={5}>Phân bón</Title>
                    </Group>
                    <ScrollArea>
                      <Group wrap="nowrap">
                        {form.items.map((item, i) => (
                          <Card
                            h={140}
                            miw={300}
                            key={i}
                            withBorder
                            radius="md"
                            shadow="xs"
                            p="md"
                          >
                            <Group grow wrap="nowrap">
                              <Image
                                src={item.img}
                                w={100}
                                h={100}
                                fit="cover"
                              />

                              <Stack gap={4} flex={1}>
                                <Title order={4}>{item.name}</Title>
                                <Text size="sm">
                                  <b>Loại:</b> {item.category}
                                </Text>
                                <Text size="sm">
                                  <b>Số lượng:</b> {item.quantity} {item.unit}
                                </Text>
                                <Text size="sm">
                                  <b>Quy cách:</b> {item.spec}
                                </Text>
                              </Stack>
                            </Group>
                          </Card>
                        ))}
                      </Group>
                    </ScrollArea>
                  </Stack>
                </Card>
                <Card withBorder radius={4} p="md">
                  <Stack>
                    <Group>
                      <IconSettings size={18} />
                      <Title order={5}>Máy móc thiết bị</Title>
                    </Group>
                    <ScrollArea>
                      <Group wrap="nowrap">
                        {form.items_vehicle.map((item, i) => (
                          <Card
                            h={150}
                            key={i}
                            withBorder
                            radius="md"
                            shadow="xs"
                            p="md"
                          >
                            <Group wrap="nowrap">
                              <Image src={item.img} w={100} h={100} />
                              <Stack gap={4}>
                                <Title order={4}>{item.name}</Title>
                                <Text size="sm">
                                  <b>Loại:</b> {item.category}
                                </Text>
                                <Text size="sm">
                                  <b>Số lượng:</b> {item.quantity} {item.unit}
                                </Text>
                              </Stack>
                            </Group>
                          </Card>
                        ))}
                      </Group>
                    </ScrollArea>
                  </Stack>
                </Card>
                <Divider label="Đối tác" labelPosition="center" my="xs" />
                <SelectableEnterpriseCards isCheckbox={false} />

                {form.summary && (
                  <>
                    <Divider label="Mô tả" labelPosition="center" my="xs" />
                    <Text size="sm">📝 {form.summary}</Text>
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
                Thêm mới hợp đồng thành công!
              </Text>
              <Text fz={"md"} ta="center" c="dimmed">
                Hợp đồng mới đã được tạo thành công. Bạn có thể xem lại thông
                tin chi tiết trong danh sách hợp đồng.
              </Text>

              <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
                Xác nhận
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        {activeStep < 5 && (
          <Group justify="space-between" mt="xl">
            <Button
              radius={4}
              variant="default"
              onClick={() => setActiveStep((p) => Math.max(p - 1, 0))}
              disabled={activeStep === 0}
            >
              Quay lại
            </Button>
            {activeStep < 4 ? (
              <Button radius={4} onClick={() => setActiveStep((p) => p + 1)}>
                Tiếp theo
              </Button>
            ) : (
              <Button radius={4} onClick={() => setActiveStep((p) => p + 1)}>
                Hoàn thành
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
};

export default ContractManagementAddPage;
