import {
  Button,
  Group,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  Card,
  Input,
  Divider,
  Select,
  NumberInput,
  Image,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import {
  IconArrowLeft,
  IconBuildingBank,
  IconPhoto,
  IconSearch,
  IconUpload,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectableSupplierCards } from "../../../SupplyManagementPage/Add/components/SelectableSupplierCards";
import BankSelect from "../../../../components/BankList";

const DebtManagementReceivableAddPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPaymentType, setSelectedPaymentType] = useState<
    "invoice" | "batch"
  >("invoice");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const nextStep = () => setActiveStep((current) => Math.min(current + 1, 3));
  const prevStep = () => setActiveStep((current) => Math.max(current - 1, 0));

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
        <Title order={3}>Thêm mới phiếu công nợ phải thu</Title>
      </Group>
      <Stack gap="lg">
        <Stepper active={activeStep} onStepClick={setActiveStep}>
          <Stepper.Step
            label="Bước 1"
            description="Thông tin khách hàng/đối tác"
          >
            <Stack gap="xs">
              <Input.Wrapper label="Phân loại">
                <Group gap="md">
                  <Button
                    variant={
                      selectedCategory === "customer" ? "filled" : "outline"
                    }
                    leftSection={<IconUser size={18} />}
                    onClick={() => setSelectedCategory("customer")}
                    radius={4}
                  >
                    Khách hàng
                  </Button>
                  <Button
                    variant={
                      selectedCategory === "partner" ? "filled" : "outline"
                    }
                    leftSection={<IconBuildingBank size={18} />}
                    radius={4}
                    onClick={() => setSelectedCategory("partner")}
                  >
                    Đối tác (chọn một)
                  </Button>
                </Group>
              </Input.Wrapper>
              <TextInput
                radius={4}
                placeholder={
                  selectedCategory === "customer"
                    ? "Chọn khách hàng"
                    : "Chọn đối tác"
                }
                label={
                  selectedCategory === "customer" ? "Khách hàng" : "Đối tác"
                }
                rightSection={
                  <IconSearch size={18} style={{ cursor: "pointer" }} />
                }
                leftSection={<IconSearch size={18} />}
              />
              <SelectableSupplierCards isMultiple={false} isCheckbox={false} />
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label="Bước 2"
            description="Thông tin hóa đơn hoặc đợt thanh toán"
          >
            <Stack gap="md">
              <Input.Wrapper label="Hình thức thanh toán">
                <Group gap="md">
                  <Button
                    variant={
                      selectedPaymentType === "invoice" ? "filled" : "outline"
                    }
                    onClick={() => setSelectedPaymentType("invoice")}
                    radius={4}
                  >
                    Theo hóa đơn
                  </Button>
                  <Button
                    variant={
                      selectedPaymentType === "batch" ? "filled" : "outline"
                    }
                    onClick={() => setSelectedPaymentType("batch")}
                    radius={4}
                  >
                    Theo đợt thanh toán
                  </Button>
                </Group>
              </Input.Wrapper>

              {selectedPaymentType === "invoice" && (
                <Stack gap="md">
                  <TextInput
                    label="Mã hóa đơn"
                    placeholder="Nhập mã hóa đơn"
                    radius={4}
                  />
                  <TextInput
                    label="Số tiền"
                    placeholder="Nhập số tiền"
                    radius={4}
                  />
                  <Input.Wrapper label="Tệp đính kèm">
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
                            Bỏ và thả file tại đây
                          </Text>
                          <Text size="sm" c="dimmed" inline mt={7}>
                            Đính kèm file (tối đa 5MB)
                          </Text>
                        </div>
                      </Group>
                    </Dropzone>
                  </Input.Wrapper>
                </Stack>
              )}

              {selectedPaymentType === "batch" && (
                <Stack gap="md">
                  <NumberInput
                    label="Số tiền đã thanh toán"
                    placeholder="Nhập số tiền đã thanh toán"
                    radius={4}
                  />
                  <TextInput
                    label="Chủ tài khoản"
                    placeholder="Nhập tên chủ tài khoản"
                    radius={4}
                  />
                  <TextInput
                    label="Số tài khoản"
                    placeholder="Nhập số tài khoản"
                    radius={4}
                  />
                  <BankSelect />
                  <TextInput
                    label="Mã SWIFT"
                    placeholder="Nhập mã SWIFT"
                    radius={4}
                  />
                  <Select
                    label="Phương thức thanh toán"
                    placeholder="Nhập phương thức thanh toán"
                    radius={4}
                    data={[
                      {
                        value: "bank_transfer",
                        label: "Chuyển khoản ngân hàng",
                      },
                      { value: "cash", label: "Tiền mặt" },
                      { value: "credit_card", label: "Thẻ tín dụng" },
                      { value: "momo", label: "Ví MoMo" },
                    ]}
                  />
                  <TextInput
                    label="Mã giao dịch / mã hoá đơn"
                    placeholder="Nhập mã giao dịch / mã hoá đơn"
                    radius={4}
                  />
                </Stack>
              )}
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Bước 3" description="Xác nhận thông tin">
            <Card withBorder shadow="sm" radius={4} p="lg">
              <Stack gap="md">
                <Title order={4} fw={500}>
                  Xác nhận thông tin công nợ
                </Title>
                <Divider />

                {/* Phân loại */}
                <Group justify="space-between">
                  <Text fw={500}>Phân loại:</Text>
                  <Text>
                    {selectedCategory === "customer" ? "Khách hàng" : "Đối tác"}
                  </Text>
                </Group>

                {/* Tên liên hệ */}
                <Group justify="space-between">
                  <Text fw={500}>Tên liên hệ:</Text>
                  <Text>Nguyễn Văn A</Text>
                </Group>

                {/* Số điện thoại */}
                <Group justify="space-between">
                  <Text fw={500}>Số điện thoại:</Text>
                  <Text>0123456789</Text>
                </Group>

                {/* Hình thức thanh toán */}
                <Group justify="space-between">
                  <Text fw={500}>Hình thức thanh toán:</Text>
                  <Text>
                    {selectedPaymentType === "invoice"
                      ? "Theo hóa đơn"
                      : "Theo đợt thanh toán"}
                  </Text>
                </Group>

                {/* Mã hóa đơn */}
                {selectedPaymentType === "invoice" && (
                  <Group justify="space-between">
                    <Text fw={500}>Mã hóa đơn:</Text>
                    <Text>INV001</Text>
                  </Group>
                )}

                {/* Số tiền */}
                <Group justify="space-between">
                  <Text fw={500}>Số tiền:</Text>
                  <Text fw={700} color="green">
                    5,000,000 VNĐ
                  </Text>
                </Group>

                {/* Thông tin tài khoản (nếu theo đợt thanh toán) */}
                {selectedPaymentType === "batch" && (
                  <>
                    <Group justify="space-between">
                      <Text fw={500}>Chủ tài khoản:</Text>
                      <Text>Nguyễn Văn B</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Số tài khoản:</Text>
                      <Text>123456789</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Ngân hàng:</Text>
                      <Text>Vietcombank</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Mã SWIFT:</Text>
                      <Text>VCB12345</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Phương thức thanh toán:</Text>
                      <Text>Chuyển khoản ngân hàng</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text fw={500}>Mã giao dịch:</Text>
                      <Text>TXN123456</Text>
                    </Group>
                  </>
                )}

                {/* Tệp đính kèm */}
                <Group justify="space-between" align="center">
                  <Text fw={500}>Tệp đính kèm:</Text>
                  <Group gap="sm">
                    <Text color="blue" style={{ cursor: "pointer" }}>
                      Xem file
                    </Text>
                  </Group>
                </Group>
              </Stack>
            </Card>
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
                Thêm mới công nợ phải thu thành công!
              </Text>
              <Text fz={"md"} ta="center" c="dimmed">
                Công nợ mới đã được thêm thành công. Bạn có thể xem lại thông
                tin chi tiết trong danh sách công nợ.
              </Text>

              <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
                Xác nhận
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        {activeStep < 3 && (
          <Group justify="space-between">
            <Button
              variant="outline"
              radius={4}
              onClick={prevStep}
              disabled={activeStep === 0}
            >
              Quay lại
            </Button>
            {activeStep === 2 ? (
              <Button onClick={nextStep} radius={4}>
                Hoàn thành
              </Button>
            ) : (
              <Button radius={4} onClick={nextStep}>
                Tiếp theo
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
};

export default DebtManagementReceivableAddPage;
