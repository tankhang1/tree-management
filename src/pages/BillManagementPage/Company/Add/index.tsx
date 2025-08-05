import {
  Card,
  Stack,
  TextInput,
  NumberInput,
  Select,
  Button,
  Group,
  Title,
  Divider,
  Text,
  Image,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stepper } from "@mantine/core";

const BillManagementCompanyAddPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    billId: "BILL001",
    orderId: "ORD001",
    issueDate: new Date("2025-08-01"),
    totalAmount: 1000000,
    discountAmount: 50000,
    paymentAmount: 950000,
    companyName: "Công ty TNHH ABC",
    companyPhone: "0123456789",
    companyTaxCode: "123456789",
    companyContactName: "Nguyễn Văn A",
    status: "paid",
  });

  const handleNextStep = () => {
    if (activeStep < 4) setActiveStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  return (
    <Card withBorder shadow="sm" p="lg" radius={4}>
      <Group mb={"xs"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Thêm mới hoá đơn</Title>
      </Group>

      <Stack gap="lg">
        <Stepper active={activeStep} onStepClick={setActiveStep}>
          {/* Step 1: Thông tin hóa đơn */}
          <Stepper.Step label="Bước 1" description="Nhập thông tin cơ bản">
            <Stack gap="xs">
              <Group grow>
                <TextInput
                  label="Mã hóa đơn"
                  placeholder="Nhập mã hóa đơn"
                  value={formData.billId}
                  radius={4}
                  withAsterisk
                />
                <Select
                  label="Mã đơn hàng"
                  searchable
                  placeholder="Nhập mã đơn hàng"
                  value={formData.orderId}
                  data={[
                    {
                      value: "ORD001",
                      label: "ORD001 - Đơn hàng ngày 01/08/2025",
                    },
                    {
                      value: "ORD002",
                      label: "ORD002 - Đơn hàng ngày 02/08/2025",
                    },
                    {
                      value: "ORD003",
                      label: "ORD003 - Đơn hàng ngày 03/08/2025",
                    },
                    {
                      value: "ORD004",
                      label: "ORD004 - Đơn hàng ngày 04/08/2025",
                    },
                    {
                      value: "ORD005",
                      label: "ORD005 - Đơn hàng ngày 05/08/2025",
                    },
                  ]}
                  radius={4}
                  withAsterisk
                />
              </Group>
              <DatePickerInput
                label="Ngày phát hành"
                placeholder="Ngày phát hành"
                locale="vi"
                value={formData.issueDate}
                radius={4}
                withAsterisk
              />
            </Stack>
          </Stepper.Step>

          {/* Step 2: Thông tin thanh toán */}
          <Stepper.Step label="Bước 2" description="Nhập số tiền">
            <Group grow>
              <NumberInput
                label="Tổng tiền"
                placeholder="Nhập tổng tiền"
                value={formData.totalAmount}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, totalAmount: +value || 0 }))
                }
                radius={4}
                withAsterisk
              />
              <NumberInput
                label="Số tiền giảm trừ"
                placeholder="Nhập số tiền giảm trừ"
                value={formData.discountAmount}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    discountAmount: +value || 0,
                  }))
                }
                radius={4}
              />
              <NumberInput
                label="Tổng tiền thanh toán"
                placeholder="Nhập tổng tiền thanh toán"
                value={formData.paymentAmount}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentAmount: +value || 0,
                  }))
                }
                radius={4}
                withAsterisk
              />
            </Group>
          </Stepper.Step>

          {/* Step 3: Thông tin xuất hóa đơn */}
          <Stepper.Step label="Bước 3" description="Nhập thông tin công ty">
            <Stack gap="md">
              <TextInput
                label="Tên công ty"
                placeholder="Nhập tên công ty"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyName: e.currentTarget.value,
                  }))
                }
                radius={4}
                withAsterisk
              />
              <TextInput
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                value={formData.companyPhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyPhone: e.currentTarget.value,
                  }))
                }
                radius={4}
                withAsterisk
              />
              <TextInput
                label="Mã số thuế (MST)"
                placeholder="Nhập mã số thuế"
                value={formData.companyTaxCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyTaxCode: e.currentTarget.value,
                  }))
                }
                radius={4}
                withAsterisk
              />
              <TextInput
                label="Tên người liên hệ"
                placeholder="Nhập tên người liên hệ"
                value={formData.companyContactName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyContactName: e.currentTarget.value,
                  }))
                }
                radius={4}
                withAsterisk
              />
              <Select
                label="Trạng thái"
                placeholder="Trạng thái"
                data={[
                  { value: "pending", label: "Chờ xử lý" },
                  { value: "paid", label: "Đã thanh toán" },
                  { value: "cancelled", label: "Đã hủy" },
                ]}
                value={formData.status}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value || "" }))
                }
                radius={4}
                withAsterisk
              />
            </Stack>
          </Stepper.Step>

          {/* Step 4: Xác nhận */}
          <Stepper.Step label="Bước 4" description="Kiểm tra thông tin">
            <Stack gap="md">
              <Title order={4}>Xác nhận thông tin hóa đơn</Title>
              <Divider />
              <Group grow align="flex-start">
                <Card withBorder shadow="sm" radius="md" p="lg">
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fw={500}>Mã hóa đơn:</Text>
                      <Text>{formData.billId}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Mã đơn hàng:</Text>
                      <Text>{formData.orderId}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Ngày phát hành:</Text>
                      <Text>{formData.issueDate?.toLocaleDateString()}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Tổng tiền:</Text>
                      <Text color="blue">
                        {formData.totalAmount.toLocaleString("vi-VN")} đ
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Số tiền giảm trừ:</Text>
                      <Text color="blue">
                        {formData.discountAmount.toLocaleString("vi-VN")} đ
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Tổng tiền thanh toán:</Text>
                      <Text color="green" fw={700}>
                        {formData.paymentAmount.toLocaleString("vi-VN")} đ
                      </Text>
                    </Group>
                  </Stack>
                </Card>

                <Card withBorder shadow="sm" radius="md" p="lg">
                  <Title order={5} fw={500}>
                    Thông tin công ty
                  </Title>
                  <Divider my="sm" />
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fw={500}>Tên công ty:</Text>
                      <Text>{formData.companyName}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Số điện thoại:</Text>
                      <Text>{formData.companyPhone}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Mã số thuế:</Text>
                      <Text>{formData.companyTaxCode}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Tên người liên hệ:</Text>
                      <Text>{formData.companyContactName}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Trạng thái:</Text>
                      <Text>
                        {formData.status === "paid"
                          ? "Đã thanh toán"
                          : formData.status === "pending"
                          ? "Chờ xử lý"
                          : "Đã hủy"}
                      </Text>
                    </Group>
                  </Stack>
                </Card>
              </Group>
            </Stack>
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
                Thêm mới hoá đơn thành công!
              </Text>
              <Text fz={"md"} ta="center" c="dimmed">
                Bạn đã hoàn thành việc tạo hoá đơn mới. Bạn có thể xem lại thông
                tin chi tiết trong danh sách hoá đơn.
              </Text>

              <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
                Xác nhận
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        {/* Nút điều hướng */}
        {activeStep < 4 && (
          <Group justify="space-between">
            <Button radius={4} variant="outline" onClick={handlePrevStep}>
              Quay lại
            </Button>
            {activeStep < 3 ? (
              <Button radius={4} onClick={handleNextStep}>
                Tiếp theo
              </Button>
            ) : (
              <Button radius={4} onClick={handleNextStep}>
                Hoàn thành
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
};

export default BillManagementCompanyAddPage;
