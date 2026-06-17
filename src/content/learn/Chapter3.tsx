import { Callout } from '../../components/learn/primitives/Callout';
import { Caveat } from '../../components/learn/primitives/Caveat';
import { CtaLink } from '../../components/learn/primitives/CtaLink';
import { SourceBackedTable } from '../../components/learn/primitives/SourceBackedTable';
import { TermExplainer } from '../../components/learn/primitives/TermExplainer';

const LICENSE_SOURCE_ID = 'ch3-restaurant-license';

export function Chapter3() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">입지·상권·임대차·인허가</h2>
        <p className="text-muted">
          계약 조건이 좋아도 장소가 맞지 않으면 매출이 따라오지 않습니다. 이 장은 상권과 입지를
          보는 법, 임대차계약에서 자주 걸려 넘어지는 함정, 그리고 가게 문을 열기까지 거쳐야 하는
          사업자등록·영업신고·인허가 순서를 정리합니다.
        </p>
      </header>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">1. 상권·입지 보는 법</h3>
        <p className="text-sm text-ink">
          입지는 한번 정하면 바꾸기 어렵습니다. 그래서 발품과 함께 공식 데이터를 같이 봐야
          합니다. 소상공인시장진흥공단의 상권분석 서비스에서 업종별 점포 수, 매출 추이, 유동인구,
          배후 인구 같은 객관적인 지표를 무료로 확인할 수 있습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
          <li>
            <span className="font-semibold">유동인구의 &lsquo;질&rsquo;</span> — 단순히 사람이 많은
            것보다, 내 업종을 실제로 이용할 사람이 지나가는지가 중요합니다.
          </li>
          <li>
            <span className="font-semibold">경쟁·배후</span> — 같은 업종이 이미 포화인지, 나를
            먹여 살릴 배후 인구(주거·직장)가 충분한지 봅니다.
          </li>
          <li>
            <span className="font-semibold">시간대·요일</span> — 점심만 붐비고 저녁엔 비는 상권인지,
            주중·주말 편차가 큰지 직접 여러 번 가서 확인합니다.
          </li>
          <li>
            <span className="font-semibold">가시성·접근성</span> — 간판이 보이는지, 들어오기 쉬운지,
            주차·대중교통은 어떤지 봅니다.
          </li>
        </ul>
        <Caveat>
          공식 상권 데이터는 과거·평균치입니다. 같은 상권 안에서도 한 블록 차이로 결과가 갈리니,
          데이터로 후보를 좁히고 현장 확인으로 결정하세요.
        </Caveat>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">2. 임대차계약의 함정</h3>
        <p className="text-sm text-ink">
          상가 임대차는 살림집 전월세와 다릅니다. 권리금, 환산보증금, 특약 같은 개념을 모르면
          큰돈이 묶이거나 떼일 수 있습니다.
        </p>
        <div className="space-y-3">
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">권리금</h4>
            <p className="text-sm text-ink">
              기존 임차인에게 자리·시설·단골(영업가치)의 대가로 주는 돈입니다. 임대인이 아니라
              앞 임차인에게 주는 돈이라, 계약서(임대차)에는 잘 나타나지 않습니다.{' '}
              <span className="font-semibold">나갈 때 그 권리금을 회수할 수 있다는 보장은
              없습니다.</span> 권리금이 적정한지, 회수 가능성이 있는지 신중히 따지세요.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">보증금과 환산보증금</h4>
            <p className="text-sm text-ink">
              <TermExplainer
                term="환산보증금"
                explanation="보증금 + (월세 × 100)으로 계산한 금액. 상가건물 임대차보호법의 일부 보호(예: 우선변제, 임대료 인상률 제한 등)를 받을 수 있는지를 가르는 기준으로 쓰입니다. 지역별로 기준 금액이 다릅니다."
              />
              은 보증금에 월세를 환산해 더한 금액으로, 이 금액이 지역별 기준 이하인지에 따라
              상가임대차보호법의 보호 범위가 달라집니다. 내 계약이 보호 대상인지 미리 확인하세요.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">특약</h4>
            <p className="text-sm text-ink">
              계약서 맨 아래 &lsquo;특약사항&rsquo;에 실제 불리한 조건이 숨어 있는 경우가 많습니다.
              원상복구 범위, 월세 인상 조건, 임대인 변경 시 처리, 명도(나가는) 조건 등을 한 줄씩
              확인하고, 구두 약속은 반드시 특약에 적어 넣으세요.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">인테리어·시설</h4>
            <p className="text-sm text-ink">
              계약 전에 전기 용량, 급·배수, 가스, 환기·후드, 화장실 같은 기본 설비가 내 업종에
              맞는지 확인하세요. 설비를 새로 끌어오면 비용이 크게 늘고, 건물 구조상 불가능한
              경우도 있습니다. 또한 나갈 때의 원상복구 범위를 미리 합의해 두세요.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">3. 사업자등록·영업신고 순서</h3>
        <p className="text-sm text-ink">
          순서를 잘못 잡으면 시설을 다 갖췄는데 영업신고가 막히거나, 신고 없이 영업해 처벌받을 수
          있습니다. 음식점을 예로 들면 대체로 다음 흐름을 따릅니다.
        </p>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-ink">
          <li>업종·입지 확정 및 임대차계약(해당 위치에서 영업이 가능한 용도인지 사전 확인)</li>
          <li>위생교육 이수 → 보건증(건강진단결과서) 발급</li>
          <li>시설 공사·설비 완료(영업신고 기준에 맞는 시설 요건 충족)</li>
          <li>관할 시·군·구청에 영업신고(일반/휴게음식점·제과점 등 업종에 맞게)</li>
          <li>세무서(또는 홈택스)에 사업자등록 신청</li>
          <li>소방·간판(옥외광고물) 등 부가 인허가·신고 처리</li>
        </ol>
        <Callout tone="warning">
          영업신고와 사업자등록은 별개입니다. 사업자등록만 했다고 음식 영업을 할 수 있는 것이
          아니며, 업종별 영업신고(또는 허가)가 따로 필요합니다. 또한 같은 자리라도 용도지역·건물
          용도에 따라 영업 자체가 불가능할 수 있으니, 계약 전에 관할 구청에 확인하세요.
        </Callout>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">4. 업종별 인허가 체크 매트릭스 (음식점 예)</h3>
        <p className="text-sm text-ink">
          업종마다 필요한 신고·교육·검사가 다릅니다. 아래는 일반적인 음식점 기준의 체크
          항목입니다. 정확한 대상·기준은 업종과 지역에 따라 다르니, 관할 구청·보건소에 꼭
          확인하세요.
        </p>
        <SourceBackedTable
          caption="음식점 인허가 체크 매트릭스"
          sourceId={LICENSE_SOURCE_ID}
          rows={[
            { label: '영업신고', value: '관할 시·군·구청', note: '일반/휴게음식점·제과점 등 업종 구분' },
            { label: '위생교육', value: '영업 전 이수', note: '업종별 식품위생교육 기관' },
            { label: '보건증(건강진단결과서)', value: '영업자·종업원', note: '보건소 등에서 검사 후 발급' },
            { label: '소방 시설', value: '시설 기준 충족·신고', note: '규모·구조에 따라 대상 상이' },
            { label: '간판(옥외광고물)', value: '관할 구청 허가·신고', note: '크기·위치 기준 있음' },
            { label: '배달·포장 표시', value: '원산지·알레르기 등 표시', note: '메뉴·플랫폼 표기 의무' },
            { label: '음악 저작권', value: '매장 음악 사용료', note: '면적·업종 기준 공연사용료' },
          ]}
        />
        <Caveat>
          위 표는 일반적인 안내입니다. 영업신고 대상·시설 기준·교육 의무·표시 의무는 업종(일반/휴게/
          제과점 등)과 지역, 매장 규모에 따라 달라집니다. 반드시 관할 시·군·구청과 보건소,
          식품안전 안내(식품의약품안전처)에서 최신 기준을 확인하세요.
        </Caveat>
      </section>

      <section className="space-y-3 rounded-xl border border-line bg-mist/40 p-4">
        <h3 className="text-base font-semibold text-ink">장소와 허가가 정해졌다면, 이제 &lsquo;돈&rsquo;입니다</h3>
        <p className="text-sm text-ink">
          입지·임대차·인허가까지 그림이 그려졌다면, 다음은 실제로 얼마가 드는지입니다. 다음
          장에서는 가맹비·인테리어·권리금·초도물품까지 초기비용 전체를 한눈에 정리하고, 최악의
          경우 잃는 돈까지 계산합니다.
        </p>
        <CtaLink href="#learn/ch4-startup-cost">창업에 드는 돈 — 초기비용 전체 지도 보러 가기</CtaLink>
      </section>
    </div>
  );
}
