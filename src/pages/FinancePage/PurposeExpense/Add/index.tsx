import {
  Button,
  Card,
  Group,
  Stack,
  Stepper,
  TextInput,
  Title,
  NumberInput,
  Select,
  Textarea,
  Badge,
  Input,
  MultiSelect,
  Text,
  Image,
  Divider,
  ScrollAreaAutosize,
  ActionIcon,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconBuilding,
  IconBuildingStore,
  IconHeartHandshake,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { SelectableEnterpriseCards } from "../../../StockManagementPage/Delivery/Add/components/SelectableEnterpriseCards";
import Scrollable from "../../../../components/Scrollable";
import { useNavigate } from "react-router-dom";
import { ContactListCards } from "../../components/ContactListCards";
import { DateTimePicker } from "@mantine/dates";
const BANKS = [
  {
    bank: "Techcombank (TCB)",
    accountHolder: "Nguyễn Văn A",
    accountNumber: "19001234567890",
    branch: "Chi nhánh Sài Gòn",
    note: "Tài khoản giao dịch chính",
    image:
      "data:image/png;base64,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",
  },
  {
    bank: "Vietcombank (VCB)",
    accountHolder: "Nguyễn Văn A",
    accountNumber: "0011001234567",
    branch: "Chi nhánh Hà Nội",
    note: "Dùng cho thanh toán nội bộ",
    image:
      "data:image/jpeg;base64,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",
  },
];
type TExplain = {
  name: string;
  price: number;
};
const FinancePurposeExpenseAddPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedBank, setSelectedBank] = useState<string>();
  const [listExplain, setListExplain] = useState<TExplain[]>([
    { name: "Thu tiền hợp đồng số 12345", price: 50000000 },
    { name: "Thu tiền đặt cọc khách hàng A", price: 30000000 },
    { name: "Thu tiền bán hàng tháng 7", price: 20000000 },
  ]);
  const nextStep = () => setActiveStep((current) => Math.min(current + 1, 2));
  const prevStep = () => setActiveStep((current) => Math.max(current - 1, 0));
  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
  };
  // Dữ liệu mẫu
  const defaultData = {
    payerType: "Doanh nghiệp",
    payerName: "Công ty ABC",
    receiverName: "Nguyễn Văn A",
    purpose: "Thu nợ",
    content: "Thu tiền hợp đồng số 12345",
    fund: "Quỹ tiền mặt",
    title: "Thu tiền hợp đồng số 12345",
    documentNumber: "CT001",
    paymentMethod: "Tiền mặt",
    bankInfo: "",
    amount: 5000000,
  };

  return (
    <Stack gap="lg">
      <Group mb="xs">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Thêm mới mục đích chi</Title>
      </Group>

      <Stepper active={activeStep} onStepClick={setActiveStep}>
        {/* Bước 1: Thông tin định danh */}
        <Stepper.Step label="Bước 1" description="Thông tin định danh">
          <Card shadow="sm" padding="lg" radius={4}>
            <Stack gap="md">
              <Input.Wrapper label="Đối tượng chi">
                <Group gap="md">
                  <Button
                    variant="filled"
                    leftSection={<IconBuilding size={18} />}
                    radius={4}
                  >
                    Doanh nghiệp
                  </Button>
                  <Button
                    variant={"outline"}
                    leftSection={<IconBuildingStore size={18} />}
                    radius={4}
                  >
                    Nông hộ
                  </Button>
                  <Button
                    variant={"outline"}
                    leftSection={<IconHeartHandshake size={18} />}
                    radius={4}
                  >
                    Khách hàng
                  </Button>
                </Group>
              </Input.Wrapper>
              <TextInput
                radius={4}
                placeholder="Đối tượng chi"
                leftSection={<IconBuilding size={18} />}
              />
              <SelectableEnterpriseCards isCheckbox={false} isMulti={false} />
              <TextInput radius={4} label="Người chi" placeholder="Người chi" />
              <ContactListCards isTouchable={true} />
              <Input.Wrapper label="Đối tượng nhận">
                <Group gap="md">
                  <Button
                    variant="filled"
                    leftSection={<IconBuilding size={18} />}
                    radius={4}
                  >
                    Doanh nghiệp
                  </Button>
                  <Button
                    variant={"outline"}
                    leftSection={<IconBuildingStore size={18} />}
                    radius={4}
                  >
                    Nông hộ
                  </Button>
                  <Button
                    variant={"outline"}
                    leftSection={<IconHeartHandshake size={18} />}
                    radius={4}
                  >
                    Khách hàng
                  </Button>
                </Group>
              </Input.Wrapper>

              <TextInput
                radius={4}
                placeholder="Chọn người nhận"
                leftSection={<IconBuilding size={18} />}
              />
              <SelectableEnterpriseCards isCheckbox={false} isMulti={false} />
              <TextInput
                radius={4}
                label="Người nhận"
                placeholder="Người nhận"
              />
              <ContactListCards isTouchable={true} />
              <MultiSelect
                radius={4}
                label="Mục đích"
                placeholder="Chọn mục đích"
                data={[
                  {
                    value: "chi_ho",
                    label: "Thu hộ",
                  },
                  {
                    value: "chi_no",
                    label: "Thu nợ",
                  },
                  {
                    value: "chi_khac",
                    label: "Khác",
                  },
                  {
                    value: "chi_ban_hang",
                    label: "Thu từ bán hàng",
                  },
                  {
                    value: "chi_dau_tu",
                    label: "Thu từ đầu tư",
                  },
                  {
                    value: "chi_thanh_ly",
                    label: "Thu thanh lý tài sản",
                  },
                  {
                    value: "chi_hoan_ung",
                    label: "Thu hoàn ứng",
                  },
                ]}
              />
              <Textarea
                radius={4}
                label="Nội dung"
                placeholder="Nhập nội dung"
                defaultValue={defaultData.content}
              />
            </Stack>
          </Card>
        </Stepper.Step>

        {/* Bước 2: Thông tin chứng từ */}
        <Stepper.Step label="Bước 2" description="Thông tin mục đích chi">
          <Card shadow="sm" padding="lg" radius={4}>
            <Stack gap="md">
              {/* Quản lý nhóm mục đích chi */}
              <Stack gap="md">
                {/* Mục đích 1 */}
                <Card shadow="xs" padding="md" radius={4} withBorder>
                  <Title order={5}>Thu nợ</Title>
                  <Divider my={"md"} />
                  <Group gap="sm" align="flex-start">
                    <Stack flex={1} gap={"xs"}>
                      <Group>
                        <Title order={6}>Danh sách diễn giải</Title>
                        <Button
                          variant="light"
                          color="green"
                          radius={4}
                          onClick={() =>
                            setListExplain((prev) => [
                              ...prev,
                              { name: "", price: 0 },
                            ])
                          }
                        >
                          Thêm diễn giải
                        </Button>
                      </Group>
                      <ScrollAreaAutosize h={400}>
                        <Stack gap={"xs"}>
                          {listExplain.map((explain, index) => (
                            <Group key={index} gap="xs" align="flex-end">
                              <TextInput
                                label="Nội dung"
                                placeholder="Số tiền"
                                defaultValue={explain.name}
                                radius={4}
                                flex={1}
                              />
                              <NumberInput
                                label="Số tiền"
                                placeholder="Số tiền"
                                defaultValue={explain.price}
                                radius={4}
                                flex={1}
                              />
                              <ActionIcon
                                variant="light"
                                radius={4}
                                color="red"
                                onClick={() =>
                                  setListExplain((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Group>
                          ))}
                        </Stack>
                      </ScrollAreaAutosize>
                      <Group align="center">
                        <Title order={4}>Tổng tiền chi</Title>
                        <Text fz={"h1"} c={"green"} fw={500}>
                          {(100000000).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Text>
                      </Group>
                    </Stack>
                    <Stack flex={1} gap={"xs"}>
                      <TextInput
                        label="Tiêu đề"
                        placeholder="Nhập tiêu đề"
                        defaultValue="Thu tiền hợp đồng số 12345"
                        radius={4}
                      />
                      <TextInput
                        label="Số hiệu chứng từ"
                        placeholder="Nhập số hiệu chứng từ"
                        defaultValue="CT001"
                        radius={4}
                      />
                      <DateTimePicker
                        label="Ngày tạo chứng từ"
                        radius={4}
                        locale="vi"
                      />
                      <Select
                        label="Hình thức chi"
                        placeholder="Chọn hình thức"
                        data={["Tiền mặt", "Chuyển khoản"]}
                        defaultValue="Tiền mặt"
                        radius={4}
                      />
                      <TextInput
                        label="Thông tin ngân hàng"
                        placeholder="Nhập thông tin ngân hàng (nếu có)"
                        radius={4}
                      />
                      <Scrollable>
                        <Group>
                          {BANKS.map((b, i) => (
                            <Card
                              key={i}
                              withBorder
                              radius={4}
                              p="sm"
                              onClick={() => handleBankSelect(b.bank)}
                              style={{
                                cursor: "pointer",
                                borderColor:
                                  selectedBank === b.bank ? "green" : undefined,
                              }}
                            >
                              <Stack gap={2}>
                                <Group gap={"xs"}>
                                  <strong>Ngân hàng:</strong>
                                  <Group>
                                    <Image src={b.image} w={20} h={20} />{" "}
                                    {b.bank}
                                  </Group>
                                </Group>
                                <Text size="sm">
                                  <strong>Chủ tài khoản:</strong>{" "}
                                  {b.accountHolder}
                                </Text>
                                <Text size="sm">
                                  <strong>Số tài khoản:</strong>{" "}
                                  {b.accountNumber}
                                </Text>
                                <Text size="sm">
                                  <strong>Chi nhánh:</strong> {b.branch}
                                </Text>
                                <Text size="sm">
                                  <strong>Ghi chú:</strong> {b.note}
                                </Text>
                              </Stack>
                            </Card>
                          ))}
                        </Group>
                      </Scrollable>
                    </Stack>
                  </Group>
                </Card>

                {/* Mục đích 2 */}
                <Card shadow="xs" padding="md" radius={4} withBorder>
                  <Title order={5}>Thu từ bán hàng</Title>
                  <Divider my={"md"} />
                  <Group gap="sm" align="flex-start">
                    <Stack flex={1} gap={"xs"}>
                      <Group>
                        <Title order={6}>Danh sách diễn giải</Title>
                        <Button
                          variant="light"
                          color="green"
                          radius={4}
                          onClick={() =>
                            setListExplain((prev) => [
                              ...prev,
                              { name: "", price: 0 },
                            ])
                          }
                        >
                          Thêm diễn giải
                        </Button>
                      </Group>
                      <ScrollAreaAutosize h={400}>
                        <Stack gap={"xs"}>
                          {listExplain.map((explain, index) => (
                            <Group key={index} gap="xs" align="flex-end">
                              <TextInput
                                label="Nội dung"
                                placeholder="Số tiền"
                                defaultValue={explain.name}
                                radius={4}
                                flex={1}
                              />
                              <NumberInput
                                label="Số tiền"
                                placeholder="Số tiền"
                                defaultValue={explain.price}
                                radius={4}
                                flex={1}
                              />
                              <ActionIcon
                                variant="light"
                                radius={4}
                                color="red"
                                onClick={() =>
                                  setListExplain((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Group>
                          ))}
                        </Stack>
                      </ScrollAreaAutosize>
                      <Group align="center">
                        <Title order={4}>Tổng tiền chi</Title>
                        <Text fz={"h1"} c={"green"} fw={500}>
                          {(100000000).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Text>
                      </Group>
                    </Stack>
                    <Stack flex={1} gap={"xs"}>
                      <TextInput
                        label="Tiêu đề"
                        placeholder="Nhập tiêu đề"
                        defaultValue="Thu tiền hợp đồng số 12345"
                        radius={4}
                      />
                      <TextInput
                        label="Số hiệu chứng từ"
                        placeholder="Nhập số hiệu chứng từ"
                        defaultValue="CT001"
                        radius={4}
                      />
                      <DateTimePicker label="Ngày tạo chứng từ" radius={4} />
                      <Select
                        label="Hình thức chi"
                        placeholder="Chọn hình thức"
                        data={["Tiền mặt", "Chuyển khoản"]}
                        defaultValue="Tiền mặt"
                        radius={4}
                      />
                      <TextInput
                        label="Thông tin ngân hàng"
                        placeholder="Nhập thông tin ngân hàng (nếu có)"
                        radius={4}
                      />
                      <Scrollable>
                        <Group>
                          {BANKS.map((b, i) => (
                            <Card
                              key={i}
                              withBorder
                              radius={4}
                              p="sm"
                              onClick={() => handleBankSelect(b.bank)}
                              style={{
                                cursor: "pointer",
                                borderColor:
                                  selectedBank === b.bank ? "green" : undefined,
                              }}
                            >
                              <Stack gap={2}>
                                <Group gap={"xs"}>
                                  <strong>Ngân hàng:</strong>
                                  <Group>
                                    <Image src={b.image} w={20} h={20} />{" "}
                                    {b.bank}
                                  </Group>
                                </Group>
                                <Text size="sm">
                                  <strong>Chủ tài khoản:</strong>{" "}
                                  {b.accountHolder}
                                </Text>
                                <Text size="sm">
                                  <strong>Số tài khoản:</strong>{" "}
                                  {b.accountNumber}
                                </Text>
                                <Text size="sm">
                                  <strong>Chi nhánh:</strong> {b.branch}
                                </Text>
                                <Text size="sm">
                                  <strong>Ghi chú:</strong> {b.note}
                                </Text>
                              </Stack>
                            </Card>
                          ))}
                        </Group>
                      </Scrollable>
                    </Stack>
                  </Group>
                </Card>
              </Stack>

              {/* Tổng hợp thông tin */}
              <Badge variant="light" size="lg">
                Tổng số chứng từ: 2 | Tổng tiền: 200,000,000 VND
              </Badge>
            </Stack>
          </Card>
        </Stepper.Step>
        {/* Bước 3: Xác nhận */}
        <Stepper.Step label="Bước 3" description="Xác nhận">
          <Card shadow="sm" padding="lg" radius={4}>
            <Stack gap="md">
              {/* Thông tin đối tượng chi */}
              <Card shadow="xs" padding="md" radius={4} withBorder>
                <Title order={5}>Thông tin đối tượng chi</Title>
                <Divider my="sm" />
                <Group justify="apart">
                  <Text fw={500}>Đối tượng chi:</Text>
                  <Text>{defaultData.payerType}</Text>
                </Group>
                <Group justify="apart">
                  <Text fw={500}>Tên đối tượng chi:</Text>
                  <Text>{defaultData.payerName}</Text>
                </Group>
                <Group justify="apart">
                  <Text fw={500}>Người chi:</Text>
                  <Text>{defaultData.receiverName}</Text>
                </Group>
                <Group justify="apart">
                  <Text fw={500}>Số điện thoại người chi:</Text>
                  <Text>0123 456 789</Text>
                </Group>
                <Group justify="apart">
                  <Text fw={500}>Email người chi:</Text>
                  <Text>receiver@example.com</Text>
                </Group>

                <Group justify="apart">
                  <Text fw={500}>Nội dung:</Text>
                  <Text>{defaultData.content}</Text>
                </Group>
                <Divider my="sm" />
                <Group justify="apart">
                  <Text fw={500}>Địa chỉ:</Text>
                  <Text>123 Đường ABC, Quận 1, TP.HCM</Text>
                </Group>
                <Group justify="apart">
                  <Text fw={500}>Mã số thuế:</Text>
                  <Text>123456789</Text>
                </Group>
                <Group justify="apart">
                  <Text fw={500}>Ghi chú:</Text>
                  <Text>Đối tượng chi quan trọng</Text>
                </Group>
              </Card>

              <Card shadow="sm" padding="lg" radius={4} withBorder>
                <Stack gap="md">
                  <Title order={4}>Danh sách chứng từ</Title>
                  {/* Mục đích 1: Thu nợ */}
                  <Card shadow="xs" padding="md" radius={4} withBorder>
                    <Title order={5}>Thu nợ</Title>
                    <Divider my="md" />

                    <Stack gap="sm">
                      <Title order={6}>Danh sách diễn giải</Title>
                      <Stack>
                        {listExplain.map((explain, index) => (
                          <Group key={index} justify="apart">
                            <Text>{explain.name}</Text>
                            <Text fw={500} c="green">
                              {explain.price.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </Text>
                          </Group>
                        ))}
                      </Stack>

                      <Group justify="apart" mt="sm">
                        <Text fw={500}>Tổng tiền chi:</Text>
                        <Text fz="lg" fw={600} c="green">
                          {(100000000).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Text>
                      </Group>

                      <Divider my="sm" />

                      <Stack gap={4}>
                        <Group justify="apart">
                          <Text c="dimmed">Tiêu đề:</Text>
                          <Text>Thu tiền hợp đồng số 12345</Text>
                        </Group>
                        <Group justify="apart">
                          <Text c="dimmed">Số hiệu chứng từ:</Text>
                          <Text>CT001</Text>
                        </Group>
                        <Group justify="apart">
                          <Text c="dimmed">Ngày tạo chứng từ:</Text>
                          <Text>08/08/2025 10:30</Text>
                        </Group>
                        <Group justify="apart">
                          <Text c="dimmed">Hình thức chi:</Text>
                          <Text>Tiền mặt</Text>
                        </Group>
                        <Group justify="apart">
                          <Text c="dimmed">Thông tin ngân hàng:</Text>
                          <Text>Ngân hàng Vietcombank, CN Hà Nội</Text>
                        </Group>
                      </Stack>
                    </Stack>
                  </Card>

                  {/* Mục đích 2: Thu từ bán hàng */}
                  <Card shadow="xs" padding="md" radius={4} withBorder>
                    <Title order={5}>Thu từ bán hàng</Title>
                    <Divider my="md" />

                    <Stack gap="sm">
                      <Title order={6}>Danh sách diễn giải</Title>
                      <Stack>
                        {listExplain.map((explain, index) => (
                          <Group key={index} justify="apart">
                            <Text>{explain.name}</Text>
                            <Text fw={500} c="green">
                              {explain.price.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </Text>
                          </Group>
                        ))}
                      </Stack>

                      <Group justify="apart" mt="sm">
                        <Text fw={500}>Tổng tiền chi:</Text>
                        <Text fz="lg" fw={600} c="green">
                          {(100000000).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Text>
                      </Group>

                      <Divider my="sm" />

                      <Stack gap={4}>
                        <Group justify="apart">
                          <Text c="dimmed">Tiêu đề:</Text>
                          <Text>Thu tiền hợp đồng số 12345</Text>
                        </Group>
                        <Group justify="apart">
                          <Text c="dimmed">Số hiệu chứng từ:</Text>
                          <Text>CT002</Text>
                        </Group>
                        <Group justify="apart">
                          <Text c="dimmed">Ngày tạo chứng từ:</Text>
                          <Text>08/08/2025 14:15</Text>
                        </Group>
                        <Group justify="apart">
                          <Text c="dimmed">Hình thức chi:</Text>
                          <Text>Chuyển khoản</Text>
                        </Group>
                        <Group justify="apart">
                          <Text c="dimmed">Thông tin ngân hàng:</Text>
                          <Text>Ngân hàng BIDV, CN TP.HCM</Text>
                        </Group>
                      </Stack>
                    </Stack>
                  </Card>

                  {/* Tổng hợp thông tin */}
                  <Badge variant="light" size="lg" mt="md">
                    Tổng số chứng từ: 2 | Tổng tiền: 200,000,000 VND
                  </Badge>
                </Stack>
              </Card>

              <Divider my="sm" />

              {/* Tổng hợp */}
              <Card shadow="xs" padding="md" radius={4} withBorder>
                <Stack gap="sm">
                  <Group justify="apart">
                    <Text fw={700} size="lg">
                      Tổng tiền:
                    </Text>
                    <Text fw={700} size="lg" color="green">
                      15,000,000 VND
                    </Text>
                  </Group>
                  <Divider my="sm" />

                  <Group justify="apart">
                    <Text fw={500} size="md">
                      Người tạo:
                    </Text>
                    <Text fw={500} size="md">
                      Nguyễn Văn A
                    </Text>
                  </Group>
                  <Group justify="apart">
                    <Text fw={500} size="md">
                      Ghi chú:
                    </Text>
                    <Text fw={500} size="md">
                      Tổng hợp các chứng từ chi quan trọng
                    </Text>
                  </Group>
                </Stack>
              </Card>
            </Stack>
          </Card>
        </Stepper.Step>
      </Stepper>

      {/* Nút điều hướng */}
      <Group justify="space-between">
        <Button
          variant="default"
          onClick={prevStep}
          disabled={activeStep === 0}
          radius={4}
        >
          Quay lại
        </Button>
        <Button onClick={nextStep} disabled={activeStep === 2} radius={4}>
          {activeStep === 2 ? "Hoàn tất" : "Tiếp tục"}
        </Button>
      </Group>
    </Stack>
  );
};

export default FinancePurposeExpenseAddPage;
