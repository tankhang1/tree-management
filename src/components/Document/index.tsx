import { FileInput, Group, Radio, Stack, Text } from "@mantine/core";
import { IconFileTypePdf } from "@tabler/icons-react";
import { useState } from "react";
import SunEditor from "suneditor-react";

type TDocument = {
  title1?: string;
  title2?: string;
};
const Document = ({
  title1 = "Tài liệu kỹ thuật",
  title2 = "Nội dung kỹ thuật",
}: TDocument) => {
  const [type, setType] = useState("0");
  return (
    <Stack gap={"xs"}>
      <Radio.Group label={title1} onChange={setType}>
        <Group mt="xs">
          <Radio value="0" label="Tải file PDF" />
          <Radio value="1" label="Nhập nội dung trực tiếp" />
        </Group>
      </Radio.Group>

      {type === "0" ? (
        <FileInput
          label={title1}
          placeholder="Chọn tài liệu"
          accept="application/pdf"
          leftSection={<IconFileTypePdf size={18} />}
          radius={4}
        />
      ) : (
        <Stack>
          <Text style={{ fontSize: 14, fontWeight: 500 }}>{title2}</Text>
          <SunEditor setOptions={{ height: "200px" }} />
        </Stack>
      )}
    </Stack>
  );
};

export default Document;
