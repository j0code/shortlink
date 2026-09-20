import { assertEquals } from "@std/assert"
import { sanitizeLink } from "./sanitize.ts"

const cases = [
	{
		input:
			"https://example.com/watch?v=abc123&t=42s&utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale&utm_term=running+shoes&utm_content=header_cta&gclid=TeStGclid123&fbclid=TeStFbclid456",
		expected: "https://example.com/watch?v=abc123&t=42s",
	}, {
		input:
			"https://example.com/search?search_query=deno+testing&page=2&msclkid=MsTest123&ttclid=TtTest456&twclid=TwTest789&li_fat_id=LiTest101&igshid=IgTest112&epik=EpTest131&dclid=DclidTest141",
		expected: "https://example.com/search?search_query=deno+testing&page=2",
	}, {
		input:
			"https://example.com/article?id=123&lang=en&mtm_source=matomo&mtm_medium=cpc&mtm_campaign=summer&mtm_content=ad1&mtm_kwd=shoes&mtm_cid=999",
		expected: "https://example.com/article?id=123&lang=en",
	}, {
		input:
			"https://example.com/shop?category=shoes&sort=price_asc&aff_sub=aff1&aff_sub2=aff2&aff_sub3=aff3&aff_sub4=aff4&aff_sub5=aff5&subid=sub1&subid1=sub2",
		expected: "https://example.com/shop?category=shoes&sort=price_asc",
	}, {
		input:
			"https://example.com/products?q=red+shoes&filter=in_stock&sharedid=shared1&irmp=irmp1&irad=irad1&irclickid=irclick1&click_id=click1&clickid=click2&tid=tid1",
		expected: "https://example.com/products?q=red+shoes&filter=in_stock",
	}, {
		input:
			"https://example.com/list?page=3&limit=20&aff_click_id=affclick1&cjevent=cj1&awc=awc1&u=u1&tag=tag1&pid=pid1&offer_id=offer1",
		expected: "https://example.com/list?page=3&limit=20",
	}, {
		input:
			"https://example.com/dashboard?tab=overview&index=1&ck_subscriber_id=ck1&eloqua=eloqua1&m_adid=mad1&m_cost=mcost1&m_campaign_type=mtype1&m_placement=mplace1&message_profile_id=msg1",
		expected: "https://example.com/dashboard?tab=overview&index=1",
	}, {
		input:
			"https://example.com/report?start=2024-01-01&end=2024-12-31&source_action_id=src1&source_action_name=email&ref=ref1&source=source1&via=via1&cid=cid1&campid=camp1",
		expected: "https://example.com/report?start=2024-01-01&end=2024-12-31",
	}, {
		input:
			"https://example.com/watch?v=xyz&list=playlist1&ad_id=ad1&adset_id=adset1&campaign_id=camp1&il_adp=iladp1&il_cid=ilcid1&il_asid=ilasid1&il_adid=iladid1",
		expected: "https://example.com/watch?v=xyz&list=playlist1",
	}, {
		input:
			"https://example.com/search?search_query=test&page=1&comet_source=cs&comet_network=cn&comet_campaign=cc&comet_ad_group=cag&comet_ad_id=cad&comet_keyword=ck&dd=dd1",
		expected: "https://example.com/search?search_query=test&page=1",
	}, {
		input:
			"https://example.com/search?q=shoes&sort=relevance&ddsrc=ddsrc1&ddcmp=ddcmp1&ddcmpid=ddcmpid1&ddkw=ddkw1&ddpl=ddpl1&dddv=dddv1&ddnw=ddnw1&ddag=ddag1",
		expected: "https://example.com/search?q=shoes&sort=relevance",
	}, {
		input:
			"https://example.com/product?id=99&lang=de&tp_source=tps&tp_adid=tpa&tp_productid=tpp&tp_campaignid=tpc&l5s=l5s1&l5m=l5m1&l5cid=l5cid1&l5adid=l5adid1",
		expected: "https://example.com/product?id=99&lang=de",
	}, {
		input:
			"https://example.com/watch?v=video1&t=10s&l5kw=l5kw1&mkt_network=mkt1&l5p=l5p1&l5t=l5t1&si=si1&is=is1&pp=pp1",
		expected: "https://example.com/watch?v=video1&t=10s",
	}, {
		input:
			"https://example.com/campaign?page=1&filter=active&utm_id=utm1&utm_source_platform=platform1&utm_creative_format=format1&utm_marketing_tactic=tactic1&mtm_group=group1&mtm_placement=placement1",
		expected: "https://example.com/campaign?page=1&filter=active",
	},
]

Deno.test("sanitize links", () => {
	for (const { input, expected } of cases) {
		assertEquals(sanitizeLink(input), expected)
	}
})