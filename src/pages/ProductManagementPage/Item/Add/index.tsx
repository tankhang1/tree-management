import {
  Group,
  Stack,
  Text,
  Button,
  TextInput,
  Stepper,
  Card,
  Title,
  Input,
  Image,
  MultiSelect,
  Select,
  Textarea,
  NumberInput,
  Divider,
  ScrollArea,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  IconArrowLeft,
  IconBox,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconTools,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { types } from "../../Type";
import SunEditor from "suneditor-react";
import Scrollable from "../../../../components/Scrollable";
const bomList = [
  {
    group: "Nguyên vật liệu",
    name: "Phân NPK",
    quantity: 50,
    unit: "Kg",
    note: "Nguyên liệu chính để sản xuất sản phẩm.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR13HYMgDcPhnAzZ6lY8iTNwApj5XWCanAClQ&s",
  },

  {
    group: "Sản phẩm",
    name: "Mứt sầu riêng Ri6",
    quantity: 100,
    unit: "Hộp",
    note: "Sản phẩm đóng gói hoàn chỉnh.",
    img: "https://mutngon.com/upload/images/sau-rieng-monthong-nguyen-mui-say-thang-hoa-gion-don-mut-ngon-nafarm.jpg",
  },
];
const productList = [
  {
    productCode: "SP001",
    productName: "Mứt sầu riêng Ri6",
    tree: "Sầu riêng",
    category: "Thực phẩm chế biến",
    description: "Sản phẩm được làm từ sầu riêng Ri6, đóng gói 250g.",
    img: "https://mutngon.com/upload/images/sau-rieng-monthong-nguyen-mui-say-thang-hoa-gion-don-mut-ngon-nafarm.jpg",
  },
  {
    productCode: "SP002",
    productName: "Cafe hạt nguyên chất",
    tree: "Cà phê",
    category: "Đồ uống",
    description: "Cafe Arabica thu hoạch tại Đắk Lắk, rang mộc.",
    img: "https://caphenguyenchat.net/wp-content/uploads/2021/06/ca-phe-nguyen-chat-co-tac-dung-gi-01.jpg",
  },
  {
    productCode: "SP003",
    productName: "Chuối sấy dẻo",
    tree: "Chuối",
    category: "Thực phẩm sấy",
    description: "Chuối sấy dẻo đóng gói 100g, không chất bảo quản.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwfg09hQiiHhgWNJZx_wrQAu-SWPqTz0yfAw&s",
  },
];
export const materialList = [
  {
    materialCode: "MAT001",
    materialName: "Phân NPK",
    description: "Phân NPK 16-16-8, dùng để bón cây trồng.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR13HYMgDcPhnAzZ6lY8iTNwApj5XWCanAClQ&s",
  },
  {
    materialCode: "MAT002",
    materialName: "Phân hữu cơ",
    description: "Phân hữu cơ vi sinh, cải tạo đất.",
    img: "https://glawvn.com/wp-content/uploads/2023/04/phan-huu-co-la-gi-cac-loai-phan-huu-co-hien-hanh.jpeg",
  },
  {
    materialCode: "MAT003",
    materialName: "Hạt giống lúa",
    description: "Hạt giống lúa chất lượng cao, năng suất tốt.",
    img: "https://dantocmiennui-media.baotintuc.vn/images/c9bca312d68a4cb9c6013396197925b3d1b8e36a1725d1ac6318a949e7a3f3e724dfb1e5a06e02d6e56da454907910f8c375e3c3907454255baf9e67f8135c667a2f0b35f3ac576d14e6307ca755e480/cach-de-hat-lua-gong-nay-mam-deu-500x375-1.jpg.webp",
  },
  {
    materialCode: "MAT004",
    materialName: "Thuốc trừ sâu sinh học",
    description:
      "Thuốc trừ sâu chiết xuất từ thảo mộc, an toàn cho môi trường.",
    img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSWdIJle1qN2zNKe_CjjhGw2TPp4jsHuxiOOUQtPZaPRAABIbYfEauqdBPULtpa7JuWrRPAdErA1KHsuP3ft8wCMazBgfffnS_uywYctxKiDJcikmkOkZnH1w",
  },
  {
    materialCode: "MAT005",
    materialName: "Vôi bột nông nghiệp",
    description: "Dùng để cải tạo đất phèn, trung hòa độ chua trong đất.",
    img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSO2Af9ScDAA7rmWqP2PsP6lc9hk3uBU2CfJwasdgOdgWbclh88uC9gB3BJtB2xkbse9GYzWF1kjS90gA305K3Q4ji9RUUZfx5V_AzbKBTR4SMARnGJ7s1s",
  },
  {
    materialCode: "MAT006",
    materialName: "Thuốc kích thích ra rễ",
    description: "Giúp cây con nhanh ra rễ, khỏe mạnh hơn.",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSpZPO0sCyeXaPNWvuAaZQcHv-zj9SemCjqLhifqfVZHS5Mr1gqBbF7SdeIxT3dd2q84YofT8Nh7iWrhxYfbKAE8cL793omW3yHYef1r6cya9D4Z0TcG_lseA",
  },
  {
    materialCode: "MAT007",
    materialName: "Bạt phủ nông nghiệp",
    description: "Bạt phủ chống cỏ, giữ ẩm, dùng cho luống cây trồng.",
    img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSm5l9z3oFM0uh8rbKp8gnfK20RDWFj6HHf5MAaKPfPatMrrh9fzbO1XxlWxu-BIoDt8vtGfq7GKvc3i2E-oEDeoq9VZ7bjFsY5IKAThaI",
  },
  {
    materialCode: "MAT008",
    materialName: "Bình xịt thuốc trừ sâu",
    description: "Dụng cụ phun thuốc bảo vệ thực vật, dung tích 16 lít.",
    img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQQCDRspucc8pqH16rieMgeZX5siFFZ9iRUgR1B9eYTa-UgQoEopIykf3So-aO4QbwlscA4GnP4pCAh5AYAiyWTA96rk2NSne6xWlcQMBUlWhAUeXhCgLnqGg",
  },
  {
    materialCode: "MAT009",
    materialName: "Phân vi sinh EM",
    description: "Phân sinh học chứa vi khuẩn có lợi, cải thiện đất và rễ.",
    img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQP4FJZXw9PcGUBhnkGHWnrgoeCo6zgRf7vE_kIx9C-n6PxTKW0pOUSbX_1QCQDzHSjA43khaS9pq6Mx8ocq_jhJyczO4qOsJRQd9aoDNLOPbuJopKBAa2WoNA",
  },
  {
    materialCode: "MAT010",
    materialName: "Hạt giống rau cải xanh",
    description: "Giống rau cải dễ trồng, thu hoạch sau 30 ngày.",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRxMoV4-jqQfNn8be6eyFD8JgaUuQCUxiclJDsLbJNF0OwzV8ZSr1Acu_qk9u8HBA1cMiuRPffRAPEwgrEDoGdJUAMMA6PAnD_eMJ5D2BxHHV-C9nLtY1tJUA",
  },
];

const ProductManagementItemAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [form, setForm] = useState({
    productCode: "SP001",
    productName: "Sầu riêng Ri6",
    tree: "Sầu riêng",
    category: "Trái cây",
    newCategory: "",
    content:
      "Sầu riêng Ri6 là loại trái cây đặc sản của Việt Nam, nổi tiếng với hương vị thơm ngon.",
    filterGroup: "Tất cả",
    selectedGroup: "Trái cây",
    quantity: 100,
    unit: "Kg",
    note: "Sản phẩm được thu hoạch từ vườn đạt chuẩn VietGAP.",
    importPrice: 50000, // Giá nhập (VNĐ)
    salePrice: 80000, // Giá bán (VNĐ)
    discount: 10, // Chiết khấu (%)
    weight: 30,
    packaging: "Bịch 30 kg", // Quy cách
    imageFile: null,
    bomType: "Nguyên Vật Liệu",
  });

  return (
    <Card withBorder shadow="md" radius={4} p="xl">
      <Title order={3} mb="lg"></Title>
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo mới sản phẩm</Title>
      </Group>
      <Stack>
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
        >
          <Stepper.Step label="Bước 1" description="Thông tin cơ bản">
            <Group grow gap={"xs"} align="flex-start">
              <Stack gap={"xs"}>
                <TextInput
                  label="Mã sản phẩm"
                  placeholder="VD: SP001"
                  value={form.productCode}
                  onChange={(e) =>
                    setForm({ ...form, productCode: e.currentTarget.value })
                  }
                  radius={4}
                />
                <TextInput
                  label="Tên sản phẩm"
                  placeholder="VD: Sầu riêng Ri6"
                  value={form.productName}
                  onChange={(e) =>
                    setForm({ ...form, productName: e.currentTarget.value })
                  }
                  radius={4}
                />
                <TextInput
                  placeholder="Loại sản phẩm"
                  label="Loại sản phẩm (chọn một)"
                  leftSection={<IconSearch size={18} />}
                  radius={4}
                />

                <Scrollable h={220}>
                  <Group gap="md" p={"xs"} wrap="nowrap">
                    {types.map((category, index) => (
                      <Card
                        h={200}
                        key={index}
                        withBorder
                        shadow="sm"
                        radius={4}
                        style={{
                          width: "150px",
                          cursor: "pointer",
                          borderColor:
                            form.category === category.name
                              ? "green"
                              : "#d9d9d9",
                          position: "relative",
                          transition: "transform 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.02)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                        onClick={() =>
                          setForm({ ...form, category: category.name })
                        }
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

                <Input.Wrapper label="Mô tả sản phẩm">
                  <SunEditor />
                </Input.Wrapper>
              </Stack>
              <Stack gap={"xs"}>
                <Input.Wrapper label="Ảnh sản phẩm">
                  <Dropzone
                    onDrop={(files) => console.log("accepted files", files)}
                    onReject={(files) => console.log("rejected files", files)}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
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
                          Bỏ và thả ảnh sản phẩm tại đây
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          Đính kèm ảnh sản phẩm (tối đa 5MB)
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                </Input.Wrapper>

                <MultiSelect
                  label="HashTag"
                  data={[
                    "Hữu cơ",
                    "Vô cơ",
                    "Năng suất cao",
                    "Chất lượng cao",
                    "Thân thiện môi trường",
                    "Dễ sử dụng",
                    "Phổ biến",
                    "Xuất khẩu",
                    "Đặc sản",
                    "Giống mới",
                  ]}
                  radius={4}
                />
              </Stack>
            </Group>
          </Stepper.Step>
          <Stepper.Step label="Bước 2" description="Thông tin BOM (nếu có)">
            <Stack>
              <Card withBorder shadow="sm" radius="md" p="md">
                <Stack>
                  <Group>
                    {["Sản phẩm", "Nguyên Vật Liệu"].map((group) => (
                      <Button
                        key={group}
                        variant={form.bomType === group ? "filled" : "light"}
                        radius={4}
                        onClick={() => setForm({ ...form, bomType: group })}
                        leftSection={
                          group === "Sản phẩm" ? (
                            <IconBox size={18} />
                          ) : (
                            <IconTools size={18} />
                          )
                        }
                      >
                        {group}
                      </Button>
                    ))}
                  </Group>
                  {form.bomType === "Sản phẩm" ? (
                    <Stack gap={"xs"}>
                      <TextInput
                        placeholder="Loại sản phẩm"
                        label="Loại sản phẩm (chọn một)"
                        leftSection={<IconSearch size={18} />}
                        radius={4}
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
                                borderColor:
                                  form.category === category.name
                                    ? "green"
                                    : "#d9d9d9",
                              }}
                              onClick={() =>
                                setForm({ ...form, category: category.name })
                              }
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
                    <Select
                      label="Loại nguyên vật liệu (chọn một)"
                      placeholder="Loại nguyên vật liệu"
                      radius={4}
                      data={[
                        { value: "fertilizer", label: "Phân bón" },
                        { value: "seeds", label: "Hạt giống" },
                        { value: "tools", label: "Dụng cụ nông nghiệp" },
                        { value: "organic", label: "Phân hữu cơ" },
                        { value: "chemicals", label: "Hóa chất nông nghiệp" },
                      ]}
                    />
                  )}

                  {form.bomType === "Sản phẩm" && (
                    <Stack gap={"xs"}>
                      <TextInput
                        placeholder="Sản phẩm"
                        label="Sản phẩm (chọn một)"
                        leftSection={<IconSearch size={18} />}
                        radius={4}
                      />
                      <Scrollable h={350}>
                        <Group gap="md" p={"xs"} wrap="nowrap">
                          {productList.map((product, index) => (
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
                                borderColor:
                                  selectedProduct === product.productCode
                                    ? "green"
                                    : undefined,
                              }}
                              onClick={() =>
                                setSelectedProduct(product.productCode)
                              }
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.transform =
                                  "scale(1.02)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                            >
                              <Stack>
                                <Image
                                  src={product.img}
                                  alt={product.productName}
                                  height={150}
                                  radius="md"
                                />
                                <Text>
                                  <b>Mã sản phẩm:</b> {product.productCode}
                                </Text>
                                <Text>
                                  <b>Tên sản phẩm:</b> {product.productName}
                                </Text>

                                <Text>
                                  <b>Loại:</b> {product.category}
                                </Text>
                              </Stack>
                            </Card>
                          ))}
                        </Group>
                      </Scrollable>
                    </Stack>
                  )}
                  {form.bomType === "Nguyên Vật Liệu" && (
                    <Stack gap={"xs"}>
                      <TextInput
                        placeholder="Nguyên vật liệu"
                        label="Nguyên vật liệu (chọn một)"
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
                                borderColor:
                                  selectedMaterial === material.materialCode
                                    ? "green"
                                    : undefined,
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.transform =
                                  "scale(1.02)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                              onClick={() =>
                                setSelectedMaterial(material.materialCode)
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
                                  <b>Mã nguyên vật liệu:</b>{" "}
                                  {material.materialCode}
                                </Text>
                                <Text>
                                  <b>Tên nguyên vật liệu:</b>{" "}
                                  {material.materialName}
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
                  {form.selectedGroup && (
                    <Stack mt="md">
                      <Group grow>
                        <NumberInput
                          label="Số lượng"
                          placeholder="Nhập số lượng"
                          value={form.quantity}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              quantity: +e!,
                            })
                          }
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
                      <Textarea
                        label="Ghi chú"
                        placeholder="Nhập ghi chú (nếu có)"
                        value={form.note}
                        onChange={(e) =>
                          setForm({ ...form, note: e.currentTarget.value })
                        }
                        radius={4}
                        minRows={3}
                      />
                    </Stack>
                  )}
                </Stack>
              </Card>
              {form.selectedGroup && (
                <Button
                  radius={4}
                  variant="light"
                  leftSection={<IconPlus size={18} />}
                >
                  Thêm mới
                </Button>
              )}
            </Stack>
          </Stepper.Step>
          <Stepper.Step label="Bước 3" description="Thông tin giá">
            <Stack>
              <Card withBorder shadow="sm" radius={4} p="md">
                <Stack gap={"xs"}>
                  <Group grow>
                    <NumberInput label="Trọng lượng" radius={4} />
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
                  <Group grow gap={"xs"} align="flex-start">
                    <NumberInput
                      label="Giá nhập"
                      placeholder="Nhập giá nhập (VNĐ)"
                      value={form.importPrice}
                      onChange={(value) =>
                        setForm({ ...form, importPrice: +value || 0 })
                      }
                      radius={4}
                      min={0}
                      step={1000}
                      thousandSeparator=","
                    />
                    <NumberInput
                      label="Giá bán"
                      placeholder="Nhập giá bán (VNĐ)"
                      value={form.salePrice}
                      onChange={(value) =>
                        setForm({ ...form, salePrice: +value || 0 })
                      }
                      radius={4}
                      min={0}
                      step={1000}
                      thousandSeparator=","
                    />
                    <NumberInput
                      label="Chiết khấu (%)"
                      placeholder="Nhập chiết khấu (%)"
                      value={form.discount}
                      onChange={(value) =>
                        setForm({ ...form, discount: +value || 0 })
                      }
                      radius={4}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </Group>
                  <Group justify="flex-end">
                    <Button radius={4} variant="light" color="red">
                      Xoá
                    </Button>
                  </Group>
                </Stack>
              </Card>
              <Button
                radius={4}
                variant="light"
                leftSection={<IconPlus size={18} />}
              >
                Thêm mới
              </Button>
            </Stack>
          </Stepper.Step>
          <Stepper.Step label="Bước 4" description="Xem lại thông tin">
            <Stack>
              {/* Thông tin cơ bản */}
              <Group grow align="flex-start">
                <Card h={300} withBorder shadow="sm" radius="md" p="md">
                  <Stack>
                    <Title order={5}>Thông tin cơ bản</Title>
                    <Text>
                      <b>Mã sản phẩm:</b> {form.productCode}
                    </Text>
                    <Text>
                      <b>Tên sản phẩm:</b> {form.productName}
                    </Text>
                    <Text>
                      <b>Loại:</b> {form.category}
                    </Text>
                    <Text>
                      <b>Mô tả:</b> {form.content || "Không có"}
                    </Text>
                  </Stack>
                </Card>

                <Card h={300} withBorder radius="md">
                  <Stack gap={"xs"}>
                    <Title order={5}>Ảnh sản phẩm</Title>
                    <Image
                      src={
                        "https://images.baodantoc.vn/uploads/2021/Tháng_10/Ngafy%202/Anh/untitled%20folder/giai-phap-cho-nong-nghiep-ben-vung.jpg"
                      }
                      h={220}
                      radius={4}
                    />
                  </Stack>
                </Card>
              </Group>
              <Divider label="Thông tin BOM" />
              {["Nguyên vật liệu", "Sản phẩm"].map((group) => (
                <Card withBorder shadow="sm" radius="md" p="md" key={group}>
                  <ScrollArea>
                    <Stack>
                      <Title order={4}>{group}</Title>
                      <Group align="flex-start" wrap="nowrap">
                        {bomList
                          .filter((item) => item.group === group)
                          .map((item, index) => (
                            <Card
                              withBorder
                              key={index}
                              shadow="sm"
                              radius="md"
                              p="md"
                            >
                              <Group align="flex-start">
                                <Image src={item.img} w={100} />
                                <Stack gap={"xs"}>
                                  <Text>
                                    <b>Tên:</b> {item.name}
                                  </Text>
                                  <Text>
                                    <b>Loại:</b> {item.name}
                                  </Text>
                                  <Text>
                                    <b>Số lượng:</b> {item.quantity} {item.unit}
                                  </Text>
                                </Stack>
                              </Group>
                            </Card>
                          ))}
                      </Group>
                    </Stack>
                  </ScrollArea>
                </Card>
              ))}

              <Divider label="Thông tin giá" />
              {/* Thông tin giá */}
              <Group align="center">
                <Card
                  withBorder
                  shadow="lg"
                  radius={4}
                  p="lg"
                  style={{ maxWidth: 400 }}
                >
                  <Stack gap="sm">
                    <Title order={4} ta="center" c="green">
                      Thông tin giá
                    </Title>
                    <Divider />
                    <Text size="sm">
                      <b>Giá nhập:</b> {form.importPrice.toLocaleString()} VNĐ
                    </Text>
                    <Text size="sm">
                      <b>Giá bán:</b> {form.salePrice.toLocaleString()} VNĐ
                    </Text>
                    <Text size="sm">
                      <b>Chiết khấu:</b> {form.discount}%
                    </Text>
                    <Text size="sm">
                      <b>Trọng lượng:</b> {form.weight || "Chưa nhập"} kg
                    </Text>
                    <Text size="sm">
                      <b>Quy cách:</b> {form.packaging || "Chưa nhập"}
                    </Text>
                  </Stack>
                </Card>
                <Card
                  withBorder
                  shadow="lg"
                  radius={4}
                  p="lg"
                  style={{ maxWidth: 400 }}
                >
                  <Stack gap="sm">
                    <Title order={4} ta="center" c="green">
                      Thông tin giá
                    </Title>
                    <Divider />
                    <Text size="sm">
                      <b>Giá nhập:</b> {form.importPrice.toLocaleString()} VNĐ
                    </Text>
                    <Text size="sm">
                      <b>Giá bán:</b> {form.salePrice.toLocaleString()} VNĐ
                    </Text>
                    <Text size="sm">
                      <b>Chiết khấu:</b> {form.discount}%
                    </Text>
                    <Text size="sm">
                      <b>Trọng lượng:</b> {form.weight || "Chưa nhập"} kg
                    </Text>
                    <Text size="sm">
                      <b>Quy cách:</b> {form.packaging || "Chưa nhập"}
                    </Text>
                  </Stack>
                </Card>
                <Card
                  withBorder
                  shadow="lg"
                  radius={4}
                  p="lg"
                  style={{ maxWidth: 400 }}
                >
                  <Stack gap="sm">
                    <Title order={4} ta="center" c="green">
                      Thông tin giá
                    </Title>
                    <Divider />
                    <Text size="sm">
                      <b>Giá nhập:</b> {form.importPrice.toLocaleString()} VNĐ
                    </Text>
                    <Text size="sm">
                      <b>Giá bán:</b> {form.salePrice.toLocaleString()} VNĐ
                    </Text>
                    <Text size="sm">
                      <b>Chiết khấu:</b> {form.discount}%
                    </Text>
                    <Text size="sm">
                      <b>Trọng lượng:</b> {form.weight || "Chưa nhập"} kg
                    </Text>
                    <Text size="sm">
                      <b>Quy cách:</b> {form.packaging || "Chưa nhập"}
                    </Text>
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
                Thêm mới sản phẩm thành công!
              </Text>
              <Text fz={"md"} ta="center" c="dimmed">
                Sản phẩm mới đã được tạo thành công. Bạn có thể xem lại thông
                tin chi tiết trong danh sách sản phẩm hoặc tiếp tục thêm mới sản
                phẩm khác.
              </Text>

              <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
                Xác nhận
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        {active < 4 && (
          <Group justify="space-between" mt="md">
            <Button
              variant="default"
              onClick={() => setActive((a) => Math.max(a - 1, 0))}
              radius={4}
            >
              Quay lại
            </Button>
            {active < 3 ? (
              <Button onClick={() => setActive((a) => a + 1)} radius={4}>
                Tiếp theo
              </Button>
            ) : (
              <Button onClick={() => setActive((a) => a + 1)} radius={4}>
                Hoàn Thành
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
};
export default ProductManagementItemAddPage;
