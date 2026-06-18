import { Callout } from '../../components/learn/primitives/Callout';
import { Caveat } from '../../components/learn/primitives/Caveat';
import { CtaLink } from '../../components/learn/primitives/CtaLink';
import { TermExplainer } from '../../components/learn/primitives/TermExplainer';

export function Chapter7() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">매출이 안 나올 때 — 진단과 회복</h2>
        <p className="text-muted">
          매출이 떨어질 때 가장 위험한 건 원인을 모른 채 &lsquo;일단 줄이고 일단 버티는&rsquo;
          대응입니다. 엉뚱한 곳을 손대면 가게가 더 빨리 망가집니다. 이 장은 무엇부터
          의심할지(진단 순서), 어떤 비용은 줄여도 되고 어떤 비용은 줄이면 안 되는지, 버틸지
          손절할지를 숫자로 판단하는 법을 정리합니다.
        </p>
      </header>

      <Caveat>
        이 장은 구체적인 수치보다 <span className="font-semibold">판단의 순서와 원칙</span>을 다룹니다.
        실제 폐업·양도 비용과 절차, 세금 정산은 상황에 따라 크게 다르므로 세무사·전문가 확인이
        필요합니다.
      </Caveat>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">1. 원인 진단 순서 — 매출? 원가? 고정비?</h3>
        <p className="text-sm text-ink">
          &lsquo;돈이 안 남는다&rsquo;는 같은 증상이라도 원인은 셋 중 하나(또는 여럿)입니다.
          아래 순서대로 따져야 엉뚱한 곳을 고치지 않습니다.
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-ink">
          <li>
            <span className="font-semibold">매출이 줄었나?</span> &mdash; 손님 수가 줄었는지, 객단가가
            낮아졌는지부터 봅니다. 요일·시간대별로 쪼개 보면 전체가 빠졌는지, 특정 시간만 빠졌는지가
            드러납니다. 외부 요인(상권 변화·경쟁점 오픈)인지 내부 요인(맛·서비스·재방문 하락)인지
            구분하세요.
          </li>
          <li>
            <span className="font-semibold">원가가 올랐나?</span> &mdash; 매출은 그대로인데 안 남는다면
            <TermExplainer
              term="원가율"
              explanation="매출에서 원재료비 등 변동비가 차지하는 비율. 이 비율이 오르면 같은 매출에도 손에 남는 돈이 줄어듭니다."
            />
            이 오른 경우입니다. 식자재 단가 인상, 폐기 로스 증가, 레시피 양 조절 실패를 의심하세요.
          </li>
          <li>
            <span className="font-semibold">고정비가 무거운가?</span> &mdash; 매출·원가가 그대로인데
            적자라면 임대료·인건비·대출이자 같은 고정비가 매출 규모에 비해 큰 구조입니다. 하루아침에
            바꾸기 가장 어려운 항목입니다.
          </li>
        </ol>
        <Callout tone="info">
          진단 없이 손대면 안 됩니다. 매출 문제인데 재료를 싸구려로 바꾸면 단골까지 잃고, 고정비
          문제인데 영업시간만 늘리면 사람만 더 지칩니다. <span className="font-semibold">원인을 먼저
          숫자로 특정</span>한 다음에 처방하세요.
        </Callout>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">2. 줄여도 되는 비용 vs 줄이면 안 되는 비용</h3>
        <p className="text-sm text-ink">
          비용을 줄일 때 가장 흔한 실수는 당장 티가 안 나는 것부터 자르는 것입니다. 그러나
          티가 안 나는 비용일수록 매출의 뿌리인 경우가 많습니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-leaf/30 bg-leaf/5 p-4">
            <h4 className="mb-2 text-sm font-semibold text-forest">줄여도 되는 비용</h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
              <li>폐기 로스 — 발주·보관 개선으로 버리는 재료 줄이기</li>
              <li>효과 없는 유료 광고·프로모션(전환이 안 되는 채널)</li>
              <li>안 쓰는 구독·렌탈·과한 포장재</li>
              <li>관리만 잘하면 줄어드는 공과금(에너지·소모품 낭비)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-clay/30 bg-clay/5 p-4">
            <h4 className="mb-2 text-sm font-semibold text-clay">줄이면 안 되는 비용</h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
              <li>음식·서비스의 핵심 품질(재료 등급·양)</li>
              <li>위생·안전 — 사고 한 번이 가게를 닫는다</li>
              <li>법정 인건비(최저임금·주휴수당·4대보험)</li>
              <li>세금 적립 — 미루면 납부 시기에 더 큰 위기로</li>
            </ul>
          </div>
        </div>
        <Caveat>
          핵심 품질·위생·법정 비용을 깎으면 단기적으로 돈이 남는 듯 보여도, 단골 이탈·사고·체불로
          더 큰 손실이 돌아옵니다. &lsquo;줄이면 매출의 원인이 무너지는 비용&rsquo;은 건드리지 마세요.
        </Caveat>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">3. 버티기 vs 손절 — 감정이 아니라 숫자로</h3>
        <p className="text-sm text-ink">
          판단 기준은 과거가 아니라 <span className="font-semibold">&lsquo;앞으로 더 잃을 돈&rsquo;</span>입니다.
          사람들은 &lsquo;여기까지 쏟아부었는데&rsquo; 하는 마음(매몰비용) 때문에 손절 시점을
          놓치지만, 이미 쓴 돈은 돌아오지 않습니다.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-ink">
          <li>
            <span className="font-semibold">버티기가 합리적인 경우</span> — 적자의 원인이 일시적이고
            (시즌·공사·일시적 상권 침체) 회복 시나리오가 구체적이며, 그동안 버틸{' '}
            <TermExplainer
              term="운전자금"
              explanation="가게를 정상적으로 굴리는 데 매달 필요한 돈. 적자 기간에는 이 돈으로 버티게 됩니다."
            />
            이 남아 있을 때.
          </li>
          <li>
            <span className="font-semibold">손절을 검토해야 하는 경우</span> — 적자가 구조적이고(고정비
            과다·상권 자체 붕괴), 운전자금이 바닥나 빚으로 적자를 메우기 시작했을 때. 이때는 매달
            버티는 것이 손실을 키우는 일입니다.
          </li>
        </ul>
        <Callout tone="warning">
          결정 전에 반드시 <span className="font-semibold">&lsquo;지금 닫으면 최종적으로 얼마를 잃는가&rsquo;</span>를
          숫자로 계산하세요. 남은 대출 잔액, 원상복구비, 회수 못 한 권리금, 중도해지 위약금, 재고
          처리까지 합친 &lsquo;최악의 손실&rsquo; 계산은 CH4에서 다뤘습니다. 버틸 때 더 잃을 돈과 지금
          닫을 때 잃는 돈을 나란히 놓고 비교해야 후회 없는 결정이 됩니다.
        </Callout>
        <CtaLink href="#learn/ch4-startup-cost">최악의 경우 잃는 돈 계산 다시 보기</CtaLink>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">4. 폐업·양도 — 닫는 데도 돈과 절차가 든다</h3>
        <p className="text-sm text-ink">
          가게를 닫는 것은 &lsquo;그만두면 끝&rsquo;이 아니라 돈과 행정 절차가 함께 따라옵니다. 닫기로
          했다면 아래 비용을 미리 합산해, &lsquo;닫는 비용&rsquo;까지가 손절 손실임을 받아들여야 합니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
          <li>
            <span className="font-semibold">양도(권리 넘기기)</span> — 시설·단골·자리를 다른 사람에게
            넘기고 권리금을 일부 회수할 수 있으나, 인수자를 찾는 데 시간이 걸립니다.
          </li>
          <li>
            <span className="font-semibold">폐업(정리)</span> — 원상복구(철거)비, 남은 재고·집기 처리,
            중도해지 위약금, 남은 대출 상환이 따라옵니다.
          </li>
          <li>
            <span className="font-semibold">행정 절차</span> — 폐업신고, 부가세·종합소득세 정산(폐업한
            해의 세금도 신고해야 함), 직원이 있었다면 4대보험 상실 신고와 퇴직 정산.
          </li>
        </ul>
        <Caveat>
          폐업·양도의 구체적 비용과 세금 정산은 계약·업종·시점에 따라 크게 다릅니다. 임대차계약서의
          원상복구·중도해지 조항을 다시 확인하고, 세금 정산은 세무사와 함께 처리하세요.
        </Caveat>
      </section>

      <section className="space-y-3 rounded-xl border border-line bg-mist/40 p-4">
        <h3 className="text-base font-semibold text-ink">반대로, 매출이 잘 나올 때는?</h3>
        <p className="text-sm text-ink">
          위기만큼이나 위험한 순간이 &lsquo;잘 될 때&rsquo;입니다. 잘 벌수록 세금이 커지고, 성급한 2호점
          확장과 번아웃이 그동안 쌓은 것을 한 번에 무너뜨립니다. 다음 장에서 지속과 확장의 기본기를
          정리합니다.
        </p>
        <CtaLink href="#learn/ch8-high-sales">매출이 잘 나올 때 — 지속과 확장 보러 가기</CtaLink>
      </section>
    </div>
  );
}
