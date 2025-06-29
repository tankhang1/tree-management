import {
  Group,
  Stack,
  Text,
  Select,
  Modal,
  Button,
  TextInput,
  Textarea,
  Stepper,
  Card,
  Title,
  FileInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowLeft, IconImageInPicture } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductManagementItemAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [
    openedProductType,
    { open: openProductType, close: closeProductType },
  ] = useDisclosure(false);
  const [form, setForm] = useState({
    productCode: "",
    productName: "",
    tree: "",
    category: "",
    newCategory: "",
    content: "",
    imageFile: null,
  });

  const trees = ["Sầu riêng", "Xoài", "Chuối"];
  const categories = ["Trái cây tươi", "Đóng hộp", "Chế biến"];

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
          <Stepper.Step label="Thông tin sản phẩm">
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
              <FileInput
                label="Hình ảnh sản phẩm"
                placeholder="Chọn ảnh từ máy tính"
                accept="image/*"
                radius={4}
                value={form.imageFile}
                leftSection={<IconImageInPicture />}
                onChange={(file) =>
                  //@ts-expect-error no check
                  setForm({ ...form, imageFile: file || null })
                }
              />
              <Select
                label="Cây"
                placeholder="Chọn cây"
                data={trees}
                value={form.tree}
                onChange={(val) => setForm({ ...form, tree: val || "" })}
                radius={4}
              />
              <Group align="flex-end">
                <Select
                  label="Danh mục sản phẩm"
                  placeholder="Chọn danh mục hoặc tự nhập"
                  data={categories}
                  searchable
                  value={form.category}
                  onChange={(val) => setForm({ ...form, category: val || "" })}
                  radius={4}
                  flex={1}
                />
                <Button radius={4} onClick={openProductType}>
                  Thêm mới
                </Button>
              </Group>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Nội dung mô tả">
            <Textarea
              label="Mô tả chi tiết"
              placeholder="Nhập nội dung mô tả sản phẩm..."
              value={form.content}
              onChange={(e) =>
                setForm({ ...form, content: e.currentTarget.value })
              }
              minRows={5}
              radius={4}
            />
          </Stepper.Step>

          <Stepper.Completed>
            <Text>Sản phẩm đã được tạo thành công!</Text>
          </Stepper.Completed>
        </Stepper>

        <Group justify="space-between" mt="md">
          <Button
            variant="default"
            onClick={() => setActive((a) => Math.max(a - 1, 0))}
            radius={4}
          >
            Quay lại
          </Button>
          {active < 2 ? (
            <Button onClick={() => setActive((a) => a + 1)} radius={4}>
              Tiếp theo
            </Button>
          ) : (
            <Button radius={4}>Đóng</Button>
          )}
        </Group>
      </Stack>
      <Modal
        opened={openedProductType}
        onClose={closeProductType}
        title={<Text fw={"bold"}>Thêm mới danh mục sản phẩm</Text>}
      >
        <Stack>
          <TextInput
            placeholder="Danh mục sản phẩm"
            label="Danh mục sản phẩm"
            radius={4}
          />
          <Group justify="flex-end">
            <Button onClick={closeProductType} radius={4}>
              Lưu
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
};
export default ProductManagementItemAddPage;
