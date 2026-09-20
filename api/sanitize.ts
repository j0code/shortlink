const commonTrackingParams = [
	"gclid", // Google Ads (click id)
	"gbraid", // Google Ads (app-to-web)
	"wbraid", // Google Ads (web-to-app)
	"dclid", // Google Display & Video 360 /click id),
	"fbclid", // Meta (click id)
	"msclkid", // Microsoft Ads (click id)
	"ttclid", // TikTok Ads (click id)
	"twclid", // Twitter Ads (click id)
	"li_fat_id", // LinkedIn Ads (tracking id)
	"igshid", // Instagram (share id)
	"epik", // Pinterest Ads (click id)
	"sharedid", // impact.com (id shared by partner & brand)
	"irmp", // impact.com (partner id)
	"irad", // impact.com (ad id)
	"irclickid", // impact.com (click id)
	"im_ref", // impact.com (click id)
	"click_id", // generic click id
	"clickid", // generic click id
	"tid", // ClickBank (tracking id)
	"cjevent", // CJ Affiliate (click id)
	"awc", // Awin (click id)
	"u", // ShareASale
	"tag", // Amazon Associates (affiliate id)
	"pid", // Affise (affiliate id)
	"offer_id", // Affise, Adobe Journey Optimizer (offer id)
	"ck_subscriber_id", // ConvertKit (subscriber id)
	"m_adid", // Dfinery (ad id)
	"m_cost", // Dfinery (cost)
	"m_campaign_type", // Dfinery (campaign type)
	"m_placement", // Dfinery (placement)
	"message_profile_id", // Adobe Journey Optimizer (profile id)
	"source_action_id", // Adobe Journey Optimizer (email action id)
	"source_action_name", // Adobe Journey Optimizer (email action name)
	"cid", // generic campaign id
	"campid", // generic campaign id
	"ad_id", // generic ad id
	"adid", // generic ad id
	"adset_id", // Meta, Google Ads (ad set id)
	"adgroupid", // Meta, Google Ads (ad group id)
	"campaign_id", // generic campaign id
	"campaignid", // generic campaign id
	"mkt_network", // LayerFive
	"si", // YouTube, Spotify
	"is", // YouTube (si but reversed)
	"pp", // YouTube
	"eloqua", // Oracle Eloqua
	"ref", // generic referrer
	"source", // generic referrer
	"via", // generic referrer
]

export function sanitizeLink(link: string) {
	const url = new URL(link)

	if (!url.search) return

	const search = new URLSearchParams(url.search)
	
	commonTrackingParams.forEach(param => {
		search.delete(param)
	})

	// catch-all
	search.keys().toArray().forEach(param => {
		if (param.startsWith("utm")) search.delete(param) // UTM
		else if (param.startsWith("aff")) search.delete(param) // generic affiliate
		else if (param.startsWith("mtm")) search.delete(param) // MTM
		else if (param.startsWith("il")) search.delete(param) // Ingest Labs
		else if (param.startsWith("comet")) search.delete(param) // Cometly
		else if (param.startsWith("dd")) search.delete(param) // DataDome
		else if (param.startsWith("tp")) search.delete(param) // TrueProfit
		else if (param.startsWith("l5")) search.delete(param) // LayerFive
		else if (param.startsWith("subid")) search.delete(param) // generid subscriber id
	})

	url.search = search.toString()

	return url.href
}