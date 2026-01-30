import { Cards, Card } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '友链',
};

export default function LinksPage() {
  return (
    <div className="container py-12">
      <h1 className="mb-8 text-3xl font-bold">友链</h1>

      <h2 className="mb-4 text-2xl font-bold">HITSZ OpenAuto 站点</h2>
      <Cards>
        <Card
          href="https://stats.hoa.moe/share/LhA8O8CHnNCO39nh/hoa.moe"
          title="HOA 网站访问数据"
          description=""
          icon={<span>umami</span>}
        />
        <Card
          href="https://status.hoa.moe/"
          title="HOA 网站服务状态"
          description=""
          icon={
            <img
              src="https://uptime.kuma.pet/img/icon.svg"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
      </Cards>

      <h2 className="mb-4 text-2xl font-bold">校内社群</h2>
      <Cards>
        <Card
          href="https://osa.moe/"
          title="HITSZ 开源技术协会"
          description="HITSZ OSA 社团"
          icon={
            <img
              src="https://osa.moe/ms-icon-144x144.d07c30ea.png"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
        <Card
          href="https://qm.qq.com/cgi-bin/qm/qr?k=EmOyWeZrOaOeSoVrVLoozyKYdvjOia_t"
          title="转码交流群"
          description="931621912"
          icon={
            <img
              src="https://raw.githubusercontent.com/HITSZ-OpenAuto/hoa-moe/main/static/logos/qq.png"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
        <Card
          href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=sSff_2IgZC8w5sxlhV0rQqrsexbCNedW&authKey=L3IvOQIvtyLUnr4BiJ3Pje1KUN5pzta8bfl71KDRNB3rzmDspUK9KrrLou%2B0vT8Y&noverify=0&group_code=917854892"
          title="哈工深留学交流群"
          description="917854892"
          icon={
            <img
              src="https://raw.githubusercontent.com/HITSZ-OpenAuto/hoa-moe/main/static/logos/qq.png"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
      </Cards>

      <h2 className="mb-4 text-2xl font-bold">校内站点</h2>
      <Cards>
        <Card
          href="https://open.osa.moe/"
          title="OSA Alist 网盘"
          description="托管在 OSA 的资料备份"
          icon={
            <img
              src="https://cdn.jsdelivr.net/gh/alist-org/logo@main/logo.svg"
              alt="icon"
              style={{ width: 24, height: 24 }}
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
            <img
              src="https://raw.githubusercontent.com/HITSZ-OpenAuto/hoa-moe/main/static/logos/osa.png"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
        <Card
          href="https://trust.hitsz.edu.cn"
          title="安校通"
          description="校外访问校内资源"
          icon={
            <img
              src="https://raw.githubusercontent.com/HITSZ-OpenAuto/hoa-moe/main/static/logos/atrust.png"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
      </Cards>

      <h2 className="mb-4 text-2xl font-bold">校内项目</h2>
      <Cards>
        <Card
          href="https://github.com/HITSZ-OpenCS/HITSZ-OpenCS"
          title="HITSZ-OpenCS"
          description="哈尔滨工业大学（深圳）计算机专业课程攻略"
          icon={
            <img
              src="https://github.com/fluidicon.png"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
        <Card
          href="https://github.com/DseidLi/HITSZ-OpenDS"
          title="HITSZ-OpenDS"
          description="哈尔滨工业大学（深圳）大数据专业课程攻略"
          icon={
            <img
              src="https://github.com/fluidicon.png"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
        <Card
          href="https://n92uuvwhvl.feishu.cn/drive/folder/fldcng8q1brFQ9wjrGzs4i6UWNg"
          title="哈工大深圳网盘计划"
          description="Drive based on FeiShu"
          icon={
            <img
              src="https://p1-hera.feishucdn.com/tos-cn-i-jbbdkfciu3/84a9f036fe2b44f99b899fff4beeb963~tplv-jbbdkfciu3-image:100:100.image"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
        <Card
          href="https://hitsz.flowus.cn/"
          title="HITSZ 新生手册"
          description="面向全体哈工大（深圳）学生的信息共享手册"
          icon={
            <img
              src="https://cdn2.flowus.cn/emoji/google/u1f4d1.svg"
              alt="icon"
              style={{ width: 24, height: 24 }}
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
            <img
              src="https://raw.githubusercontent.com/HITSZ-OpenAuto/hoa-moe/main/static/logos/hsica.png"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
        <Card
          href="https://missing.criwits.top/"
          title="《你缺计课》"
          description="适合小白的计算机入门课"
          icon={
            <img
              src="https://www.criwits.top/missing/favicon.png"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
      </Cards>

      <h2 className="mb-4 text-2xl font-bold">友校项目</h2>
      <Cards>
        <Card
          href="https://man.naosi.org/"
          title="大工生存手册"
          description="大工人的一站式生存指南"
          icon={
            <img
              src="https://man.naosi.org/favicon.svg"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
        <Card
          href="https://scuteee.com/"
          title="SCUTEEE"
          description="华南理工电力电子类专业知识库"
          icon={
            <img
              src="https://scuteee.com/favicon-32x32.png"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
        <Card
          href="https://penjc.github.io/CityU/"
          title="CityU GuideBook"
          description="A comprehensive platform for CityUHK students"
          icon={
            <img
              src="https://penjc.github.io/CityU/img/favicon.ico"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
        <Card
          href="https://www.nuaastore.app/"
          title="NUAA 分享"
          description=""
          icon={
            <img
              src="https://www.nuaastore.app/logo-dark.png"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
        <Card
          href="https://yigebande.github.io/SYSU-SAA-Survival-Manual/"
          title="SYSU SAA Survival Manual"
          description="中⼭⼤学航空航天学院⽣存⼿册"
          icon={
            <img
              src="https://raw.githubusercontent.com/HITSZ-OpenAuto/hoa-moe/main/static/logos/SYSU-SAA-Survival-Manual.png"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
      </Cards>

      <h2 className="mb-4 text-2xl font-bold">个人博客</h2>
      <Cards>
        <Card
          href="https://blog.longlin.tech/"
          title="longlin 的个人小站"
          description="Simple is Complex"
          icon={
            <img
              src="https://blog.longlin.tech/favicon.svg"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
        <Card
          href="https://longbin.tech"
          title="Longbin's Blog"
          description="个人技术博客，记录所学的一切知识"
          icon={
            <img
              src="https://longbin.tech/favicon.ico"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
          }
        />
        <Card
          href="https://oliverwu.top"
          title="吴俊达的个人主页"
          description="Please stay tuned!"
        />
      </Cards>

      <Callout type="info">
        <p>我们会收录的链接包括但不限于：</p>
        <ul className="list-disc pl-4 my-2">
          <li>校内社群</li>
          <li>校内/友校类似项目</li>
          <li>个人博客</li>
        </ul>
        <p>
          你可以通过在 <strong>本项目仓库提 issues</strong> ｜{' '}
          <strong>
            发送邮件至 <a href="mailto:hi@hoa.moe">📮hi@hoa.moe</a>
          </strong>{' '}
          ｜ <strong>本页面下评论</strong> 的方式与我们交换友链
        </p>
      </Callout>
    </div>
  );
}
