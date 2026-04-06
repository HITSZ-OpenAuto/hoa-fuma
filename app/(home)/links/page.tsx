import Image from 'next/image';
import { Cards, Card } from 'fumadocs-ui/components/card';

// SVG icon from icons.yaml for umami
const UmamiIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 20 20"
    className="size-4"
  >
    <circle
      cx="10"
      cy="9.4"
      r="8"
      style={{
        fill: '#fff',
        stroke: '#000',
        strokeWidth: 0.9346,
        strokeMiterlimit: 10,
      }}
    />
    <path
      fill="#000"
      d="M19.3 7.2H.7c-.4 0-.7.3-.7.7v1.2c0 5.5 4.5 10 10 10 5.4 0 9.9-4.3 10-9.8V7.9c0-.4-.3-.7-.7-.7"
    />
  </svg>
);

export default function Page() {
  return (
    <main className="max-w-page mx-auto w-full px-4 pb-12 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">友链</h1>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">HITSZ OpenAuto 站点</h2>
        <Cards>
          <Card
            href="https://stats.hoa.moe/share/LhA8O8CHnNCO39nh/hoa.moe"
            title="HOA 网站访问数据"
            icon={<UmamiIcon />}
          />
          <Card
            href="https://status.hoa.moe/"
            title="HOA 网站服务状态"
            icon={
              <Image
                src="https://uptime.kuma.pet/img/icon.svg"
                alt="Uptime Kuma"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
        </Cards>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">校内社群</h2>
        <Cards>
          <Card
            href="https://osa.moe/"
            title="HITSZ 开源技术协会"
            description="HITSZ OSA 社团"
            icon={
              <Image
                src="https://osa.moe/ms-icon-144x144.d07c30ea.png"
                alt="OSA"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
          <Card
            href="https://qm.qq.com/cgi-bin/qm/qr?k=EmOyWeZrOaOeSoVrVLoozyKYdvjOia_t"
            title="转码交流群"
            description="931621912"
            icon={
              <Image
                src="/logos/qq.png"
                alt="QQ"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
          <Card
            href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=sSff_2IgZC8w5sxlhV0rQqrsexbCNedW"
            title="哈工深留学交流群"
            description="917854892"
            icon={
              <Image
                src="/logos/qq.png"
                alt="QQ"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
        </Cards>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">校内站点</h2>
        <Cards>
          <Card
            href="https://open.osa.moe/"
            title="OSA Alist 网盘"
            description="托管在 OSA 的资料备份"
            icon={
              <Image
                src="https://cdn.jsdelivr.net/gh/alist-org/logo@main/logo.svg"
                alt="Alist"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
          <Card
            href="http://219.223.238.14:88/ve/"
            title="课程回放"
            description="需要通过校园网访问"
          />
          <Card
            href="http://mirrors.osa.moe/"
            title="OSA 开源软件镜像站"
            description="校内镜像站"
            icon={
              <Image
                src="/logos/osa.png"
                alt="OSA"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
          <Card
            href="https://trust.hitsz.edu.cn"
            title="安校通"
            description="校外访问校内资源"
            icon={
              <Image
                src="/logos/atrust.png"
                alt="aTrust"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
        </Cards>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">校内项目</h2>
        <Cards>
          <Card
            href="https://github.com/HITSZ-OpenCS/HITSZ-OpenCS"
            title="HITSZ-OpenCS"
            description="哈尔滨工业大学（深圳）计算机专业课程攻略"
            icon={
              <Image
                src="https://github.com/fluidicon.png"
                alt="GitHub"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
          <Card
            href="https://github.com/DseidLi/HITSZ-OpenDS"
            title="HITSZ-OpenDS"
            description="哈尔滨工业大学（深圳）大数据专业课程攻略"
            icon={
              <Image
                src="https://github.com/fluidicon.png"
                alt="GitHub"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
          <Card
            href="https://n92uuvwhvl.feishu.cn/drive/folder/fldcng8q1brFQ9wjrGzs4i6UWNg"
            title="哈工大深圳网盘计划"
            description="Drive based on FeiShu"
            icon={
              <Image
                src="https://p1-hera.feishucdn.com/tos-cn-i-jbbdkfciu3/84a9f036fe2b44f99b899fff4beeb963~tplv-jbbdkfciu3-image:100:100.image"
                alt="Feishu"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
          <Card
            href="https://hitsz.flowus.cn/"
            title="HITSZ 新生手册"
            description="面向全体哈工大（深圳）学生的信息共享手册"
            icon={
              <Image
                src="https://cdn2.flowus.cn/emoji/google/u1f4d1.svg"
                alt="Flowus"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
          <Card
            href="https://xiaoyuanjishi.com/"
            title="一键导入课程表"
            description="现可直接在校园集市 App 使用"
          />
          <Card
            href="https://hsica-org-s.hitsz.edu.cn/"
            title="HSICA 飞跃手册"
            description="一份收集并展示本校区出国申请案例的文档"
            icon={
              <Image
                src="/logos/hsica.png"
                alt="HSICA"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
          <Card
            href="https://missing.criwits.top/"
            title="《你缺计课》"
            description="适合小白的计算机入门课"
            icon={
              <Image
                src="https://www.criwits.top/missing/favicon.png"
                alt="Missing"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
        </Cards>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">友校项目</h2>
        <Cards>
          <Card
            href="https://man.naosi.org/"
            title="大工生存手册"
            description="大工人的一站式生存指南"
            icon={
              <Image
                src="https://man.naosi.org/favicon.svg"
                alt="Naosi"
                width={24}
                height={24}
                className="size-4"
              />
            }
          />
          <Card
            href="https://scuteee.com/"
            title="SCUTEEE"
            description="华南理工大学课程攻略共享计划"
          />
        </Cards>
      </section>
    </main>
  );
}
